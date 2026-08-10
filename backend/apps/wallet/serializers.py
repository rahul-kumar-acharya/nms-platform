from rest_framework import serializers
from .models import Wallet, WalletTransaction

class WalletTransactionSerializer(serializers.ModelSerializer):
    member_id = serializers.CharField(source='wallet.member.member_id', read_only=True)
    member_name = serializers.CharField(source='wallet.member.full_name', read_only=True)

    class Meta:
        model = WalletTransaction
        fields = ['id', 'member_id', 'member_name', 'type', 'category', 'amount', 'balance_after', 'reference_id', 'description', 'created_at']

class WalletSummarySerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()
    total_earnings = serializers.SerializerMethodField()
    member_id = serializers.CharField(source='member.member_id', read_only=True)
    member_name = serializers.CharField(source='member.full_name', read_only=True)

    class Meta:
        model = Wallet
        fields = ['id', 'member_id', 'member_name', 'balance', 'total_earnings', 'updated_at']

    def get_balance(self, obj):
        return obj.get_balance()

    def get_total_earnings(self, obj):
        return obj.get_total_earnings()
