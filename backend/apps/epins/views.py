from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import EPIN
from apps.plans.models import Plan
from .serializers import EPINSerializer, GenerateEPINSerializer
from common.permissions import IsAdminUserRole
from common.utils import generate_epin_code

class EPINViewSet(viewsets.ModelViewSet):
    queryset = EPIN.objects.all().order_by('-created_at')
    serializer_class = EPINSerializer

    def get_permissions(self):
        if self.action == 'validate_epin':
            return [permissions.AllowAny()]
        return [IsAdminUserRole()]

    def get_queryset(self):
        queryset = EPIN.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status', None)
        plan_param = self.request.query_params.get('plan_id', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if plan_param:
            queryset = queryset.filter(plan_id=plan_param)
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == EPIN.Status.USED:
            return Response(
                {'detail': 'Redeemed/Used EPIN keys cannot be deleted as they are part of active financial audit history.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_24_NO_CONTENT if hasattr(status, 'HTTP_24_NO_CONTENT') else status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        serializer = GenerateEPINSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        plan = get_object_or_404(Plan, id=serializer.validated_data['plan_id'])
        quantity = serializer.validated_data['quantity']
        
        created_epins = []
        for _ in range(quantity):
            code = generate_epin_code(prefix=f"NMS{plan.id}")
            epin = EPIN.objects.create(
                code=code,
                plan=plan,
                created_by=request.user
            )
            created_epins.append(epin)
            
        return Response(
            EPINSerializer(created_epins, many=True).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def validate_epin(self, request):
        code = request.data.get('code', '').strip().upper()
        if not code:
            return Response({'valid': False, 'message': 'EPIN code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            epin = EPIN.objects.get(code=code)
            if epin.status != EPIN.Status.UNUSED:
                return Response({'valid': False, 'message': f'EPIN is already {epin.status.lower()}'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'valid': True,
                'code': epin.code,
                'plan_id': epin.plan.id,
                'plan_name': epin.plan.name,
                'plan_price': str(epin.plan.price)
            })
        except EPIN.DoesNotExist:
            return Response({'valid': False, 'message': 'Invalid EPIN code'}, status=status.HTTP_404_NOT_FOUND)
