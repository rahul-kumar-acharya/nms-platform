from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from apps.epins.models import EPIN
from apps.members.models import Member
from apps.wallet.models import Wallet
from apps.income.services import IncomeEngine
from common.utils import generate_member_id

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterMemberView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        mobile = data.get('mobile', '').strip()
        epin_code = data.get('epin_code', '').strip().upper()
        sponsor_id = data.get('sponsor_id', '').strip()
        parent_id = data.get('parent_id', '').strip()
        position = data.get('position', '').strip().upper()

        if not (full_name and email and password and epin_code and sponsor_id and parent_id and position):
            return Response({'detail': 'All fields are required including EPIN, Sponsor ID, Parent ID, and Position'}, status=status.HTTP_400_BAD_REQUEST)

        if position not in ['LEFT', 'RIGHT']:
            return Response({'detail': 'Position must be LEFT or RIGHT'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            epin = EPIN.objects.select_for_update().get(code=epin_code)
            if epin.status != EPIN.Status.UNUSED:
                return Response({'detail': f'EPIN is already {epin.status.lower()}'}, status=status.HTTP_400_BAD_REQUEST)
        except EPIN.DoesNotExist:
            return Response({'detail': 'Invalid EPIN code'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sponsor = Member.objects.get(member_id=sponsor_id)
        except Member.DoesNotExist:
            return Response({'detail': f'Sponsor member ID "{sponsor_id}" not found'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parent = Member.objects.get(member_id=parent_id)
        except Member.DoesNotExist:
            return Response({'detail': f'Parent member ID "{parent_id}" not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if parent position is already occupied
        existing_child = parent.binary_children.filter(position=position).first()
        if existing_child:
            return Response({'detail': f'Parent node "{parent_id}" already has a member placed on the {position} position ({existing_child.full_name})'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            next_seq = Member.objects.count() + 1
            member_id = generate_member_id(next_seq)
            
            user_handle = username if username else member_id
            user = User.objects.create_user(
                username=user_handle,
                email=email,
                password=password,
                first_name=full_name.split()[0],
                last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else '',
                role=User.Role.MEMBER,
                mobile=mobile
            )

            member = Member.objects.create(
                user=user,
                member_id=member_id,
                full_name=full_name,
                mobile=mobile,
                sponsor=sponsor,
                parent=parent,
                position=position,
                current_plan=epin.plan,
                status=Member.Status.ACTIVE,
                kyc_status=Member.KYCStatus.PENDING
            )

            # Create Wallet
            Wallet.objects.create(member=member)

            # Mark EPIN used
            epin.status = EPIN.Status.USED
            epin.used_by = member
            epin.used_at = timezone.now()
            epin.save()

            # Trigger referral payout to sponsor
            IncomeEngine.process_referral_income(member)

        return Response({
            'status': 'SUCCESS',
            'message': 'Member registered and activated successfully',
            'member': {
                'member_id': member.member_id,
                'full_name': member.full_name,
                'plan_name': member.current_plan.name,
                'sponsor_id': sponsor.member_id,
                'parent_id': parent.member_id,
                'position': member.position
            }
        }, status=status.HTTP_201_CREATED)
