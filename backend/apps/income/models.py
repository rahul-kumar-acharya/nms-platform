from django.db import models
from apps.members.models import Member

class IncomeTransaction(models.Model):
    class Type(models.TextChoices):
        REFERRAL = 'REFERRAL', 'Direct Referral Commission'
        BINARY = 'BINARY', 'Binary Pair Matching'
        BONUS = 'BONUS', 'Milestone Bonus'

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='income_transactions')
    type = models.CharField(max_length=20, choices=Type.choices)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    source_member = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True, related_name='generated_incomes')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.type} - ₹{self.amount} for {self.member.member_id}"
