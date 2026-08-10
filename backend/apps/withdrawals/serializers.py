from decimal import Decimal
from rest_framework import serializers
from .models import Withdrawal

class WithdrawalSerializer(serializers.ModelSerializer):
    member_id = serializers.CharField(source='member.member_id', read_only=True)
    member_name = serializers.CharField(source='member.full_name', read_only=True)

    class Meta:
        model = Withdrawal
        fields = ['id', 'member_id', 'member_name', 'amount', 'status', 'bank_account_no', 'ifsc_code', 'upi_id', 'admin_notes', 'created_at', 'processed_at']

class CreateWithdrawalSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=Decimal('500.00'))
    bank_account_no = serializers.CharField(max_length=50, required=False, allow_blank=True)
    ifsc_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    upi_id = serializers.CharField(max_length=50, required=False, allow_blank=True)
