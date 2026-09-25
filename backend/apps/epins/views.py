from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import EPIN
from apps.plans.models import Plan
from apps.members.models import Member
from apps.wallet.models import Wallet, WalletTransaction
from .serializers import EPINSerializer, GenerateEPINSerializer, PurchaseEPINSerializer, TransferEPINSerializer
from common.permissions import IsAdminUserRole
from common.utils import generate_epin_code

class EPINViewSet(viewsets.ModelViewSet):
    queryset = EPIN.objects.all().order_by('-created_at')
    serializer_class = EPINSerializer

    def get_permissions(self):
        if self.action == 'validate_epin':
            return [permissions.AllowAny()]
        if self.action in ['my_epins', 'purchase_with_wallet', 'transfer']:
            return [permissions.IsAuthenticated()]
        return [IsAdminUserRole()]

    def get_queryset(self):
        user = self.request.user
        queryset = EPIN.objects.all().order_by('-created_at')
        if not (user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN'):
            if hasattr(user, 'member_profile'):
                queryset = queryset.filter(assigned_to=user.member_profile)
            else:
                return EPIN.objects.none()

        status_param = self.request.query_params.get('status', None)
        plan_param = self.request.query_params.get('plan_id', None)
        search = self.request.query_params.get('search', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if plan_param:
            queryset = queryset.filter(plan_id=plan_param)
        if search:
            queryset = queryset.filter(code__icontains=search)
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == EPIN.Status.USED:
            return Response(
                {'detail': 'Redeemed/Used EPIN keys cannot be deleted as they are part of active financial audit history.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUserRole])
    def generate(self, request):
        serializer = GenerateEPINSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        plan = get_object_or_404(Plan, id=serializer.validated_data['plan_id'])
        quantity = serializer.validated_data['quantity']
        target_member_id = serializer.validated_data.get('target_member_id', '').strip()

        assigned_member = None
        if target_member_id:
            try:
                assigned_member = Member.objects.get(member_id__iexact=target_member_id)
            except Member.DoesNotExist:
                return Response({'detail': f'Target member "{target_member_id}" not found'}, status=status.HTTP_404_NOT_FOUND)
        
        created_epins = []
        for _ in range(quantity):
            code = generate_epin_code(prefix=f"NMS{plan.id}")
            epin = EPIN.objects.create(
                code=code,
                plan=plan,
                created_by=request.user,
                assigned_to=assigned_member
            )
            created_epins.append(epin)
            
        return Response(
            EPINSerializer(created_epins, many=True).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_epins(self, request):
        if not hasattr(request.user, 'member_profile'):
            return Response([], status=status.HTTP_200_OK)
        
        member = request.user.member_profile
        epins = EPIN.objects.filter(assigned_to=member).order_by('-created_at')
        status_param = request.query_params.get('status', None)
        if status_param:
            epins = epins.filter(status=status_param)
        return Response(EPINSerializer(epins, many=True).data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def purchase_with_wallet(self, request):
        if not hasattr(request.user, 'member_profile'):
            return Response({'detail': 'Only members can purchase EPINs with wallet balance'}, status=status.HTTP_403_FORBIDDEN)
        
        member = request.user.member_profile
        serializer = PurchaseEPINSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        plan = get_object_or_404(Plan, id=serializer.validated_data['plan_id'])
        quantity = serializer.validated_data['quantity']
        total_cost = plan.price * quantity

        wallet, _ = Wallet.objects.get_or_create(member=member)
        if wallet.get_balance() < total_cost:
            return Response({
                'detail': f'Insufficient wallet balance. Total cost: ₹{total_cost}, Current balance: ₹{wallet.get_balance()}'
            }, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            tx = WalletTransaction.record_transaction(
                wallet=wallet,
                tx_type=WalletTransaction.Type.DEBIT,
                category=WalletTransaction.Category.EPIN_PURCHASE,
                amount=total_cost,
                description=f"Purchased {quantity}x {plan.name} EPIN key(s)"
            )

            created_epins = []
            for _ in range(quantity):
                code = generate_epin_code(prefix=f"NMS{plan.id}")
                epin = EPIN.objects.create(
                    code=code,
                    plan=plan,
                    created_by=request.user,
                    assigned_to=member
                )
                created_epins.append(epin)

            tx.reference_id = f"EPIN-PUR-{created_epins[0].id}"
            tx.save()

        return Response({
            'status': 'SUCCESS',
            'message': f'Successfully purchased {quantity} EPIN(s) using wallet balance',
            'epins': EPINSerializer(created_epins, many=True).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def transfer(self, request, pk=None):
        epin = self.get_object()
        user = request.user
        is_admin = user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN'

        if epin.status != EPIN.Status.UNUSED:
            return Response({'detail': f'Only unused EPINs can be transferred. Current status: {epin.status}'}, status=status.HTTP_400_BAD_REQUEST)

        if not is_admin:
            if not hasattr(user, 'member_profile') or epin.assigned_to != user.member_profile:
                return Response({'detail': 'You do not have permission to transfer this EPIN'}, status=status.HTTP_403_FORBIDDEN)

        target_member_id = request.data.get('target_member_id', '').strip()
        if not target_member_id:
            return Response({'detail': 'Target member ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_member = Member.objects.get(member_id__iexact=target_member_id)
        except Member.DoesNotExist:
            return Response({'detail': f'Target member "{target_member_id}" not found'}, status=status.HTTP_404_NOT_FOUND)

        if not is_admin and target_member == user.member_profile:
            return Response({'detail': 'Cannot transfer EPIN to yourself'}, status=status.HTTP_400_BAD_REQUEST)

        epin.assigned_to = target_member
        epin.save()

        return Response({
            'status': 'SUCCESS',
            'message': f'EPIN {epin.code} successfully transferred to {target_member.full_name} ({target_member.member_id})',
            'epin': EPINSerializer(epin).data
        })

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUserRole])
    def assign_bulk(self, request):
        epin_ids = request.data.get('epin_ids', [])
        target_member_id = request.data.get('target_member_id', '').strip()

        if not epin_ids or not target_member_id:
            return Response({'detail': 'Both epin_ids and target_member_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_member = Member.objects.get(member_id__iexact=target_member_id)
        except Member.DoesNotExist:
            return Response({'detail': f'Target member "{target_member_id}" not found'}, status=status.HTTP_404_NOT_FOUND)

        updated_count = EPIN.objects.filter(id__in=epin_ids, status=EPIN.Status.UNUSED).update(assigned_to=target_member)
        return Response({
            'status': 'SUCCESS',
            'message': f'Successfully assigned {updated_count} unused EPIN(s) to {target_member.full_name} ({target_member.member_id})'
        })

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def validate_epin(self, request):
        code = request.data.get('code', '').strip().upper()
        if not code:
            return Response({'valid': False, 'message': 'EPIN code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            epin = EPIN.objects.get(code=code)
            if epin.status != EPIN.Status.UNUSED:
                return Response({'valid': False, 'message': f'EPIN is already {epin.status.lower()}'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'valid': True,
                'code': epin.code,
                'plan_id': epin.plan.id,
                'plan_name': epin.plan.name,
                'plan_price': str(epin.plan.price)
            })
        except EPIN.DoesNotExist:
            return Response({'valid': False, 'message': 'Invalid EPIN code'}, status=status.HTTP_404_NOT_FOUND)
