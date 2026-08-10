from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from apps.members.models import Member
from .services import NetworkService

class BinaryTreeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        member_id = request.query_params.get('member_id', None)
        depth = int(request.query_params.get('depth', 4))

        root_member = None
        if member_id:
            root_member = Member.objects.filter(member_id=member_id).first()
        elif hasattr(request.user, 'member_profile'):
            root_member = request.user.member_profile
        
        if not root_member:
            root_member = Member.objects.filter(is_root=True).first() or Member.objects.first()

        if not root_member:
            return Response({
                'id': 0,
                'member_id': 'ROOT',
                'name': 'Company Root Node',
                'position': 'ROOT',
                'status': 'ACTIVE',
                'left': None,
                'right': None,
                'left_count': 0,
                'right_count': 0
            }, status=status.HTTP_200_OK)

        tree_data = NetworkService.get_binary_tree_data(root_member, depth=depth)
        return Response(tree_data)

class ReferralTreeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        member_id = request.query_params.get('member_id', None)
        depth = int(request.query_params.get('depth', 3))

        root_member = None
        if member_id:
            root_member = Member.objects.filter(member_id=member_id).first()
        elif hasattr(request.user, 'member_profile'):
            root_member = request.user.member_profile

        if not root_member:
            root_member = Member.objects.filter(is_root=True).first() or Member.objects.first()

        if not root_member:
            return Response({
                'id': 0,
                'member_id': 'ROOT',
                'name': 'Company Root Node',
                'children': []
            }, status=status.HTTP_200_OK)

        tree_data = NetworkService.get_referral_tree_data(root_member, depth=depth)
        return Response(tree_data)
