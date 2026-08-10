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

        if member_id:
            root_member = get_object_or_404(Member, member_id=member_id)
        elif hasattr(request.user, 'member_profile'):
            root_member = request.user.member_profile
        else:
            root_member = Member.objects.filter(is_root=True).first()

        if not root_member:
            return Response({'detail': 'No network tree found'}, status=status.HTTP_404_NOT_FOUND)

        tree_data = NetworkService.get_binary_tree_data(root_member, depth=depth)
        return Response(tree_data)

class ReferralTreeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        member_id = request.query_params.get('member_id', None)
        depth = int(request.query_params.get('depth', 3))

        if member_id:
            root_member = get_object_or_404(Member, member_id=member_id)
        elif hasattr(request.user, 'member_profile'):
            root_member = request.user.member_profile
        else:
            root_member = Member.objects.filter(is_root=True).first()

        if not root_member:
            return Response({'detail': 'No referral tree found'}, status=status.HTTP_404_NOT_FOUND)

        tree_data = NetworkService.get_referral_tree_data(root_member, depth=depth)
        return Response(tree_data)
