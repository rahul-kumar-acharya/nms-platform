from rest_framework import serializers
from .models import Member
from apps.plans.serializers import PlanSerializer

class MemberSerializer(serializers.ModelSerializer):
    current_plan_detail = PlanSerializer(source='current_plan', read_only=True)
    sponsor_id = serializers.CharField(source='sponsor.member_id', read_only=True)
    sponsor_name = serializers.CharField(source='sponsor.full_name', read_only=True)
    parent_id = serializers.CharField(source='parent.member_id', read_only=True)

    class Meta:
        model = Member
        fields = [
            'id', 'member_id', 'full_name', 'mobile', 'sponsor', 'sponsor_id', 
            'sponsor_name', 'parent', 'parent_id', 'position', 'is_root', 
            'current_plan', 'current_plan_detail', 'status', 'kyc_status', 'joining_date'
        ]
