from rest_framework import serializers
from .models import IncomeTransaction

class IncomeTransactionSerializer(serializers.ModelSerializer):
    member_id = serializers.CharField(source='member.member_id', read_only=True)
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    source_member_id = serializers.CharField(source='source_member.member_id', read_only=True)
    source_member_name = serializers.CharField(source='source_member.full_name', read_only=True)

    class Meta:
        model = IncomeTransaction
        fields = ['id', 'member_id', 'member_name', 'type', 'amount', 'source_member_id', 'source_member_name', 'description', 'created_at']
