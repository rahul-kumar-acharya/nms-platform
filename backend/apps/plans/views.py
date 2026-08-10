from rest_framework import viewsets, permissions
from .models import Plan
from .serializers import PlanSerializer
from common.permissions import IsAdminUserRole

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all().order_by('-created_at')
    serializer_class = PlanSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsAdminUserRole]
        return [permission() for permission in permission_classes]
