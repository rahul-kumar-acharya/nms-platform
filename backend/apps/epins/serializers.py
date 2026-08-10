from rest_framework import serializers
from .models import EPIN
from apps.plans.serializers import PlanSerializer

class EPINSerializer(serializers.ModelSerializer):
    plan_detail = PlanSerializer(source='plan', read_only=True)
    used_by_member_id = serializers.CharField(source='used_by.member_id', read_only=True)

    class Meta:
        model = EPIN
        fields = ['id', 'code', 'plan', 'plan_detail', 'status', 'used_by', 'used_by_member_id', 'created_at', 'used_at', 'expires_at']

class GenerateEPINSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, max_value=100)
