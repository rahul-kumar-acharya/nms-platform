from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from .models import Withdrawal
from .serializers import WithdrawalSerializer, CreateWithdrawalSerializer
from apps.wallet.models import Wallet, WalletTransaction
from common.permissions import IsAdminUserRole

class WithdrawalViewSet(viewsets.ModelViewSet):
    queryset = Withdrawal.objects.all().order_by('-created_at')
    serializer_class = WithdrawalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Withdrawal.objects.all().order_by('-created_at')
        if not (user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN'):
            if hasattr(user, 'member_profile'):
                queryset = queryset.filter(member=user.member_profile)
            else:
                return Withdrawal.objects.none()
        return queryset

    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, 'member_profile'):
            return Response({'detail': 'Only members can submit withdrawal requests'}, status=status.HTTP_403_FORBIDDEN)
        
        member = request.user.member_profile
        if member.kyc_status != 'VERIFIED':
            return Response({'detail': 'KYC verification is required prior to withdrawal'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CreateWithdrawalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data['amount']

        wallet, _ = Wallet.objects.get_or_create(member=member)
        if wallet.get_balance() < amount:
            return Response({'detail': f'Insufficient wallet balance. Current balance: ₹{wallet.get_balance()}'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Reserve funds in ledger debit
            tx = WalletTransaction.record_transaction(
                wallet=wallet,
                tx_type=WalletTransaction.Type.DEBIT,
                category=WalletTransaction.Category.WITHDRAWAL,
                amount=amount,
                description=f"Withdrawal request of ₹{amount} (Pending Admin Approval)"
            )
            
            withdrawal = Withdrawal.objects.create(
                member=member,
                amount=amount,
                bank_account_no=serializer.validated_data.get('bank_account_no', ''),
                ifsc_code=serializer.validated_data.get('ifsc_code', ''),
                upi_id=serializer.validated_data.get('upi_id', '')
            )
            tx.reference_id = f"WD-{withdrawal.id}"
            tx.save()

        return Response(WithdrawalSerializer(withdrawal).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def approve(self, request, pk=None):
        withdrawal = self.get_object()
        if withdrawal.status != Withdrawal.Status.PENDING:
            return Response({'detail': f'Withdrawal is already {withdrawal.status}'}, status=status.HTTP_400_BAD_REQUEST)

        withdrawal.status = Withdrawal.Status.APPROVED
        withdrawal.admin_notes = request.data.get('admin_notes', 'Payout processed successfully')
        withdrawal.processed_at = timezone.now()
        withdrawal.save()
        return Response(WithdrawalSerializer(withdrawal).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def reject(self, request, pk=None):
        withdrawal = self.get_object()
        if withdrawal.status != Withdrawal.Status.PENDING:
            return Response({'detail': f'Withdrawal is already {withdrawal.status}'}, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get('admin_notes', 'Withdrawal request rejected by administrator')
        
        with transaction.atomic():
            withdrawal.status = Withdrawal.Status.REJECTED
            withdrawal.admin_notes = reason
            withdrawal.processed_at = timezone.now()
            withdrawal.save()

            # Refund reserved debit back to wallet
            wallet, _ = Wallet.objects.get_or_create(member=withdrawal.member)
            WalletTransaction.record_transaction(
                wallet=wallet,
                tx_type=WalletTransaction.Type.CREDIT,
                category=WalletTransaction.Category.WITHDRAWAL_REFUND,
                amount=withdrawal.amount,
                reference_id=f"WDR-{withdrawal.id}",
                description=f"Refund for rejected withdrawal #{withdrawal.id}: {reason}"
            )

        return Response(WithdrawalSerializer(withdrawal).data)
