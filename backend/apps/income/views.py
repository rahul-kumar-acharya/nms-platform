from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import IncomeTransaction
from .serializers import IncomeTransactionSerializer
from .services import IncomeEngine
from apps.members.models import Member

class IncomeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = IncomeTransaction.objects.all().order_by('-created_at')
    serializer_class = IncomeTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = IncomeTransaction.objects.all().order_by('-created_at')
        if not (user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN'):
            if hasattr(user, 'member_profile'):
                queryset = queryset.filter(member=user.member_profile)
            else:
                return IncomeTransaction.objects.none()
        
        income_type = self.request.query_params.get('type', None)
        if income_type:
            queryset = queryset.filter(type=income_type)
        return queryset

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def run_binary_engine(self, request):
        """
        Admin trigger to calculate binary pair matching payouts across all active members.
        """
        members = Member.objects.filter(status=Member.Status.ACTIVE)
        total_payout = 0
        processed_count = 0

        for member in members:
            payout = IncomeEngine.calculate_binary_pair_income(member)
            if payout > 0:
                total_payout += payout
                processed_count += 1

        return Response({
            'status': 'SUCCESS',
            'members_processed': processed_count,
            'total_payout_credited': str(total_payout)
        })
