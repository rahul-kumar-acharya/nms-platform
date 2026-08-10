from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count
from apps.members.models import Member
from apps.epins.models import EPIN
from apps.income.models import IncomeTransaction
from apps.wallet.models import WalletTransaction
from apps.withdrawals.models import Withdrawal
from common.permissions import IsAdminUserRole

class DashboardOverviewView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user
        
        # Unauthenticated Public Stats for Home Page
        if not user or not user.is_authenticated:
            total_members = Member.objects.count()
            unused_epins = EPIN.objects.filter(status='UNUSED').count()
            total_income_distributed = IncomeTransaction.objects.aggregate(t=Sum('amount'))['t'] or 0
            return Response({
                'role': 'PUBLIC',
                'total_members': total_members,
                'unused_epins': unused_epins,
                'total_income_distributed': str(total_income_distributed)
            })

        is_admin = user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN'

        if is_admin:
            total_members = Member.objects.count()
            active_members = Member.objects.filter(status=Member.Status.ACTIVE).count()
            pending_kyc = Member.objects.filter(kyc_status='PENDING').count()
            
            total_epins = EPIN.objects.count()
            unused_epins = EPIN.objects.filter(status='UNUSED').count()
            
            total_income_distributed = IncomeTransaction.objects.aggregate(t=Sum('amount'))['t'] or 0
            pending_withdrawals = Withdrawal.objects.filter(status='PENDING').aggregate(t=Sum('amount'))['t'] or 0
            approved_withdrawals = Withdrawal.objects.filter(status='APPROVED').aggregate(t=Sum('amount'))['t'] or 0

            return Response({
                'role': 'ADMIN',
                'total_members': total_members,
                'active_members': active_members,
                'pending_kyc': pending_kyc,
                'total_epins': total_epins,
                'unused_epins': unused_epins,
                'total_income_distributed': str(total_income_distributed),
                'pending_withdrawals': str(pending_withdrawals),
                'approved_withdrawals': str(approved_withdrawals)
            })
        else:
            if not hasattr(user, 'member_profile'):
                return Response({'detail': 'Member profile not found'}, status=404)

            member = user.member_profile
            wallet = getattr(member, 'wallet', None)
            
            balance = wallet.get_balance() if wallet else 0
            total_earnings = wallet.get_total_earnings() if wallet else 0
            direct_referrals = member.direct_referrals.count()

            return Response({
                'role': 'MEMBER',
                'member_id': member.member_id,
                'full_name': member.full_name,
                'plan_name': member.current_plan.name if member.current_plan else 'No Plan',
                'kyc_status': member.kyc_status,
                'balance': str(balance),
                'total_earnings': str(total_earnings),
                'direct_referrals_count': direct_referrals
            })
