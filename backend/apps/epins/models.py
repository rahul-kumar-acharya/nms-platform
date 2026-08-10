from django.db import models
from django.conf import settings
from apps.plans.models import Plan
from apps.members.models import Member

class EPIN(models.Model):
    class Status(models.TextChoices):
        UNUSED = 'UNUSED', 'Unused'
        USED = 'USED', 'Used'
        REVOKED = 'REVOKED', 'Revoked'

    code = models.CharField(max_length=50, unique=True, db_index=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='epins')
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.UNUSED)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    used_by = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True, related_name='used_epins')
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.code} - {self.plan.name} ({self.status})"
