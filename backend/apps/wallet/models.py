from django.db import models
from django.db import transaction
from apps.members.models import Member

class Wallet(models.Model):
    member = models.OneToOneField(Member, on_delete=models.CASCADE, related_name='wallet')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Wallet - {self.member.member_id} (Balance: ₹{self.get_balance()})"

    def get_balance(self):
        credits = self.transactions.filter(type=WalletTransaction.Type.CREDIT).aggregate(total=models.Sum('amount'))['total'] or 0
        debits = self.transactions.filter(type=WalletTransaction.Type.DEBIT).aggregate(total=models.Sum('amount'))['total'] or 0
        return credits - debits

    def get_total_earnings(self):
        return self.transactions.filter(
            type=WalletTransaction.Type.CREDIT,
            category__in=[
                WalletTransaction.Category.REFERRAL,
                WalletTransaction.Category.BINARY,
                WalletTransaction.Category.BONUS
            ]
        ).aggregate(total=models.Sum('amount'))['total'] or 0

class WalletTransaction(models.Model):
    class Type(models.TextChoices):
        CREDIT = 'CREDIT', 'Credit'
        DEBIT = 'DEBIT', 'Debit'

    class Category(models.TextChoices):
        REFERRAL = 'REFERRAL', 'Referral Commission'
        BINARY = 'BINARY', 'Binary Pair Income'
        BONUS = 'BONUS', 'Milestone Bonus'
        WITHDRAWAL = 'WITHDRAWAL', 'Withdrawal Debit'
        WITHDRAWAL_REFUND = 'WITHDRAWAL_REFUND', 'Withdrawal Refund'
        ADJUSTMENT = 'ADJUSTMENT', 'System Adjustment'

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    type = models.CharField(max_length=10, choices=Type.choices)
    category = models.CharField(max_length=20, choices=Category.choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    balance_after = models.DecimalField(max_digits=12, decimal_places=2)
    reference_id = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - ₹{self.amount} ({self.category}) for {self.wallet.member.member_id}"

    @classmethod
    def record_transaction(cls, wallet, tx_type, category, amount, description="", reference_id=None):
        with transaction.atomic():
            current_bal = wallet.get_balance()
            if tx_type == cls.Type.DEBIT and current_bal < amount:
                raise ValueError("Insufficient wallet balance for debit transaction")
            
            new_bal = current_bal + amount if tx_type == cls.Type.CREDIT else current_bal - amount
            
            tx = cls.objects.create(
                wallet=wallet,
                type=tx_type,
                category=category,
                amount=amount,
                balance_after=new_bal,
                reference_id=reference_id,
                description=description
            )
            return tx
