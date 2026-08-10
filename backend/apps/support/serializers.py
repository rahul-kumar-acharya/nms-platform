from rest_framework import serializers
from .models import SupportTicket, TicketMessage

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = TicketMessage
        fields = ['id', 'sender_name', 'sender_role', 'message', 'created_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    member_id = serializers.CharField(source='member.member_id', read_only=True)
    member_name = serializers.CharField(source='member.full_name', read_only=True)
    messages = TicketMessageSerializer(many=True, read_only=True)

    class Meta:
        model = SupportTicket
        fields = ['id', 'member_id', 'member_name', 'subject', 'category', 'status', 'messages', 'created_at', 'updated_at']
