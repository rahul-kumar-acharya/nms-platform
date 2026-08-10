from apps.members.models import Member

class NetworkService:
    @staticmethod
    def count_subtree_members(node):
        """
        Recursively counts all members in the subtree rooted at `node`.
        """
        if not node:
            return 0
        left_child = node.get_left_child()
        right_child = node.get_right_child()
        
        left_count = 1 + NetworkService.count_subtree_members(left_child) if left_child else 0
        right_count = 1 + NetworkService.count_subtree_members(right_child) if right_child else 0
        return left_count + right_count

    @staticmethod
    def get_binary_tree_data(member, depth=3):
        """
        Builds nested JSON tree object for visual rendering up to specified depth.
        """
        if not member:
            return None

        left_child = member.get_left_child()
        right_child = member.get_right_child()

        left_count = NetworkService.count_subtree_members(left_child) if left_child else 0
        right_count = NetworkService.count_subtree_members(right_child) if right_child else 0

        data = {
            'id': member.id,
            'member_id': member.member_id,
            'full_name': member.full_name,
            'plan_name': member.current_plan.name if member.current_plan else 'No Plan',
            'plan_price': str(member.current_plan.price) if member.current_plan else '0.00',
            'status': member.status,
            'position': member.position or 'ROOT',
            'left_count': left_count,
            'right_count': right_count,
            'left_child': NetworkService.get_binary_tree_data(left_child, depth - 1) if depth > 1 and left_child else None,
            'right_child': NetworkService.get_binary_tree_data(right_child, depth - 1) if depth > 1 and right_child else None
        }
        return data

    @staticmethod
    def get_referral_tree_data(member, depth=3):
        """
        Builds nested referral downline JSON object.
        """
        if not member:
            return None

        directs = member.direct_referrals.all().order_by('-joining_date')
        children_data = []
        if depth > 1:
            for child in directs:
                children_data.append(NetworkService.get_referral_tree_data(child, depth - 1))

        return {
            'id': member.id,
            'member_id': member.member_id,
            'full_name': member.full_name,
            'plan_name': member.current_plan.name if member.current_plan else 'No Plan',
            'status': member.status,
            'direct_referrals_count': directs.count(),
            'children': children_data
        }
