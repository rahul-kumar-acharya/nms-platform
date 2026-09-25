from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        DEVELOPER = 'DEVELOPER', 'System Developer'
        ADMIN = 'ADMIN', 'Platform Owner / Administrator'
        MEMBER = 'MEMBER', 'Member'

    role = models.CharField(max_length=15, choices=Role.choices, default=Role.MEMBER)
    mobile = models.CharField(max_length=20, blank=True, null=True)

    def is_admin(self):
        return self.role in [self.Role.ADMIN, self.Role.DEVELOPER] or self.is_superuser or self.is_staff

    def __str__(self):
        return f"{self.username} ({self.role})"
