from django.db import transaction
from .models import IncomeTransaction
from apps.wallet.models import Wallet, WalletTransaction
from apps.network.services import NetworkService

class IncomeEngine:
    @staticmethod
    def process_referral_income(new_member):
        """
        Triggered when new_member activates a plan.
        Credits direct referral bonus to sponsor's wallet.
        """
        sponsor = new_member.sponsor
        plan = new_member.current_plan
        if not sponsor or not plan or plan.referral_bonus <= 0:
            return None

        with transaction.atomic():
            income_tx = IncomeTransaction.objects.create(
                member=sponsor,
                type=IncomeTransaction.Type.REFERRAL,
                amount=plan.referral_bonus,
                source_member=new_member,
                description=f"Direct Referral bonus for inviting {new_member.full_name} ({new_member.member_id})"
            )
            
            # Credit wallet
            wallet, _ = Wallet.objects.get_or_create(member=sponsor)
            WalletTransaction.record_transaction(
                wallet=wallet,
                tx_type=WalletTransaction.Type.CREDIT,
                category=WalletTransaction.Category.REFERRAL,
                amount=plan.referral_bonus,
                reference_id=f"REF-{income_tx.id}",
                description=income_tx.description
            )
            return income_tx

    @staticmethod
    def calculate_binary_pair_income(member):
        """
        Calculates matched pairs for a member and credits binary pair income.
        """
        if not member or not member.current_plan or member.current_plan.binary_pair_payout <= 0:
            return 0

        left_child = member.get_left_child()
        right_child = member.get_right_child()

        left_vol = NetworkService.count_subtree_members(left_child) if left_child else 0
        right_vol = NetworkService.count_subtree_members(right_child) if right_child else 0

        matched_pairs = min(left_vol, right_vol)
        if matched_pairs <= 0:
            return 0

        # Calculate already paid pairs for this member
        existing_binary_payouts = IncomeTransaction.objects.filter(
            member=member,
            type=IncomeTransaction.Type.BINARY
        ).count()

        new_pairs_to_pay = matched_pairs - existing_binary_payouts
        if new_pairs_to_pay <= 0:
            return 0

        pair_rate = member.current_plan.binary_pair_payout
        total_payout = new_pairs_to_pay * pair_rate

        with transaction.atomic():
            income_tx = IncomeTransaction.objects.create(
                member=member,
                type=IncomeTransaction.Type.BINARY,
                amount=total_payout,
                description=f"Binary pair payout for {new_pairs_to_pay} matched pairs ({left_vol} L / {right_vol} R)"
            )

            wallet, _ = Wallet.objects.get_or_create(member=member)
            WalletTransaction.record_transaction(
                wallet=wallet,
                tx_type=WalletTransaction.Type.CREDIT,
                category=WalletTransaction.Category.BINARY,
                amount=total_payout,
                reference_id=f"BIN-{income_tx.id}",
                description=income_tx.description
            )
            return total_payout
