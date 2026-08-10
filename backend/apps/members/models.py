from django.db import models
from django.conf import settings
from apps.plans.models import Plan

class Member(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        INACTIVE = 'INACTIVE', 'Inactive'
        BLOCKED = 'BLOCKED', 'Blocked'

    class KYCStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        VERIFIED = 'VERIFIED', 'Verified'
        REJECTED = 'REJECTED', 'Rejected'

    class Position(models.TextChoices):
        LEFT = 'LEFT', 'Left'
        RIGHT = 'RIGHT', 'Right'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='member_profile')
    member_id = models.CharField(max_length=20, unique=True, db_index=True)
    full_name = models.CharField(max_length=150)
    mobile = models.CharField(max_length=20)
    
    # Sponsor: Direct referrer
    sponsor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='direct_referrals')
    
    # Parent: Placement in binary tree
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='binary_children')
    position = models.CharField(max_length=5, choices=Position.choices, null=True, blank=True)
    
    is_root = models.BooleanField(default=False)
    current_plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    kyc_status = models.CharField(max_length=10, choices=KYCStatus.choices, default=KYCStatus.PENDING)
    
    joining_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.member_id} - {self.full_name}"

    def get_left_child(self):
        return self.binary_children.filter(position=self.Position.LEFT).first()

    def get_right_child(self):
        return self.binary_children.filter(position=self.Position.RIGHT).first()
