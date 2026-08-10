from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import KYCDocument
from .serializers import KYCDocumentSerializer
from common.permissions import IsAdminUserRole

class KYCDocumentViewSet(viewsets.ModelViewSet):
    queryset = KYCDocument.objects.all().order_by('-submitted_at')
    serializer_class = KYCDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff or getattr(user, 'role', '') == 'ADMIN':
            return KYCDocument.objects.all().order_by('-submitted_at')
        if hasattr(user, 'member_profile'):
            return KYCDocument.objects.filter(member=user.member_profile)
        return KYCDocument.objects.none()

    def create(self, request, *args, **kwargs):
        if not hasattr(request.user, 'member_profile'):
            return Response({'detail': 'Only members can submit KYC'}, status=status.HTTP_403_FORBIDDEN)
        
        member = request.user.member_profile
        kyc, created = KYCDocument.objects.get_or_create(member=member)
        
        kyc.document_type = request.data.get('document_type', kyc.document_type or 'PAN')
        kyc.document_number = request.data.get('document_number', kyc.document_number or '')
        kyc.front_image_url = request.data.get('front_image_url', kyc.front_image_url or '')
        kyc.back_image_url = request.data.get('back_image_url', kyc.back_image_url or '')
        kyc.status = KYCDocument.Status.PENDING
        kyc.submitted_at = timezone.now()
        kyc.save()

        member.kyc_status = 'PENDING'
        member.save()

        return Response(KYCDocumentSerializer(kyc).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def verify(self, request, pk=None):
        kyc = self.get_object()
        kyc.status = KYCDocument.Status.VERIFIED
        kyc.admin_remarks = request.data.get('remarks', 'KYC verified and approved by admin')
        kyc.reviewed_at = timezone.now()
        kyc.save()

        member = kyc.member
        member.kyc_status = 'VERIFIED'
        member.save()

        return Response(KYCDocumentSerializer(kyc).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserRole])
    def reject(self, request, pk=None):
        kyc = self.get_object()
        kyc.status = KYCDocument.Status.REJECTED
        kyc.admin_remarks = request.data.get('remarks', 'KYC rejected due to invalid documents')
        kyc.reviewed_at = timezone.now()
        kyc.save()

        member = kyc.member
        member.kyc_status = 'REJECTED'
        member.save()

        return Response(KYCDocumentSerializer(kyc).data)
