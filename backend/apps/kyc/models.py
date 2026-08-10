from django.db import models
from apps.members.models import Member

class KYCDocument(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        VERIFIED = 'VERIFIED', 'Verified'
        REJECTED = 'REJECTED', 'Rejected'

    class DocumentType(models.TextChoices):
        AADHAAR = 'AADHAAR', 'Aadhaar Card'
        PAN = 'PAN', 'PAN Card'
        PASSPORT = 'PASSPORT', 'Passport'
        DRIVING_LICENSE = 'DRIVING_LICENSE', 'Driving License'

    member = models.OneToOneField(Member, on_delete=models.CASCADE, related_name='kyc_document')
    document_type = models.CharField(max_length=20, choices=DocumentType.choices)
    document_number = models.CharField(max_length=50)
    front_image_url = models.CharField(max_length=500, blank=True, null=True)
    back_image_url = models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PENDING)
    admin_remarks = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"KYC - {self.member.member_id} ({self.status})"
