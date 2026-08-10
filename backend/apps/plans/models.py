from django.db import models

class Plan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    referral_bonus = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    binary_pair_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    daily_capping = models.DecimalField(max_digits=10, decimal_places=2, default=10000.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (₹{self.price})"
