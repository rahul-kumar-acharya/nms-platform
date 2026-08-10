from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    member_id = serializers.SerializerMethodField()
    kyc_status = serializers.SerializerMethodField()
    plan_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'mobile', 'role', 'member_id', 'kyc_status', 'plan_name']

    def get_member_id(self, obj):
        if hasattr(obj, 'member_profile'):
            return obj.member_profile.member_id
        return None

    def get_kyc_status(self, obj):
        if hasattr(obj, 'member_profile'):
            return obj.member_profile.kyc_status
        return 'N/A'

    def get_plan_name(self, obj):
        if hasattr(obj, 'member_profile') and obj.member_profile.current_plan:
            return obj.member_profile.current_plan.name
        return 'None'
