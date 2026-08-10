from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Member
from .serializers import MemberSerializer

class MemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Member.objects.all().order_by('-joining_date')
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Member.objects.all().order_by('-joining_date')
        
        # Search & Filter
        search = self.request.query_params.get('search', None)
        status_param = self.request.query_params.get('status', None)
        
        if search:
            queryset = queryset.filter(
                Q(member_id__icontains=search) | 
                Q(full_name__icontains=search) | 
                Q(mobile__icontains=search)
            )
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        # Non-admins can only view their own profile or direct downline
        if not (user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN'):
            if hasattr(user, 'member_profile'):
                queryset = queryset.filter(
                    Q(id=user.member_profile.id) | 
                    Q(sponsor=user.member_profile)
                )
        return queryset

    @action(detail=False, methods=['get'])
    def me(self, request):
        if hasattr(request.user, 'member_profile'):
            serializer = self.get_serializer(request.user.member_profile)
            return Response(serializer.data)
        return Response({'detail': 'Member profile not found'}, status=status.HTTP_404_NOT_FOUND)
