from rest_framework import serializers
from .models import KYCDocument

class KYCDocumentSerializer(serializers.ModelSerializer):
    member_id = serializers.CharField(source='member.member_id', read_only=True)
    member_name = serializers.CharField(source='member.full_name', read_only=True)

    class Meta:
        model = KYCDocument
        fields = ['id', 'member_id', 'member_name', 'document_type', 'document_number', 'front_image_url', 'back_image_url', 'status', 'admin_remarks', 'submitted_at', 'reviewed_at']
