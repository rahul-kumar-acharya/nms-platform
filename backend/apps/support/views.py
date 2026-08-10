from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import SupportTicket, TicketMessage
from .serializers import SupportTicketSerializer, TicketMessageSerializer

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all().order_by('-created_at')
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN':
            return SupportTicket.objects.all().order_by('-created_at')
        if hasattr(user, 'member_profile'):
            return SupportTicket.objects.filter(member=user.member_profile)
        return SupportTicket.objects.none()

    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, 'member_profile'):
            return Response({'detail': 'Only members can create support tickets'}, status=status.HTTP_403_FORBIDDEN)
        
        ticket = SupportTicket.objects.create(
            member=request.user.member_profile,
            subject=request.data.get('subject', 'Support Query'),
            category=request.data.get('category', 'GENERAL')
        )
        message_text = request.data.get('message', '')
        if message_text:
            TicketMessage.objects.create(
                ticket=ticket,
                sender=request.user,
                message=message_text
            )

        return Response(SupportTicketSerializer(ticket).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        ticket = self.get_object()
        message_text = request.data.get('message', '').strip()
        if not message_text:
            return Response({'detail': 'Message content cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)

        message = TicketMessage.objects.create(
            ticket=ticket,
            sender=request.user,
            message=message_text
        )
        if request.user.is_admin():
            ticket.status = SupportTicket.Status.IN_PROGRESS
            ticket.save()

        return Response(TicketMessageSerializer(message).data, status=status.HTTP_201_CREATED)
