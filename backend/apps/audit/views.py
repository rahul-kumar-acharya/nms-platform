from rest_framework import viewsets
from .models import AuditLog
from .serializers import AuditLogSerializer
from common.permissions import IsAdminUserRole

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUserRole]
