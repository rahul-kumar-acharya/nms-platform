from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.members.models import Member
from .models import Wallet, WalletTransaction
from .serializers import WalletSummarySerializer, WalletTransactionSerializer

class WalletViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Wallet.objects.all()
    serializer_class = WalletSummarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN':
            return Wallet.objects.all()
        if hasattr(user, 'member_profile'):
            return Wallet.objects.filter(member=user.member_profile)
        return Wallet.objects.none()

    @action(detail=False, methods=['get'])
    def my_wallet(self, request):
        user = request.user
        member = getattr(user, 'member_profile', None)

        if not member:
            member = Member.objects.filter(is_root=True).first() or Member.objects.first()

        if member:
            wallet, _ = Wallet.objects.get_or_create(member=member)
            serializer = WalletSummarySerializer(wallet)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({
            'id': 0,
            'member_id': 'SYSTEM',
            'member_name': 'System Administrator',
            'balance': 0.00,
            'total_earnings': 0.00,
            'updated_at': None
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def transactions(self, request):
        user = request.user
        queryset = WalletTransaction.objects.all().order_by('-created_at')
        
        if not (user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN'):
            if hasattr(user, 'member_profile'):
                queryset = queryset.filter(wallet__member=user.member_profile)
            else:
                return Response([], status=status.HTTP_200_OK)

        category = request.query_params.get('category', None)
        tx_type = request.query_params.get('type', None)
        if category:
            queryset = queryset.filter(category=category)
        if tx_type:
            queryset = queryset.filter(type=tx_type)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = WalletTransactionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = WalletTransactionSerializer(queryset, many=True)
        return Response(serializer.data)
