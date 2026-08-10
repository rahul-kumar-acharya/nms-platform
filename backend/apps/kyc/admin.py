from django.contrib import admin
from .models import KYCDocument

@admin.register(KYCDocument)
class KYCDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id_display', 'document_type', 'document_number', 'status', 'submitted_at', 'reviewed_at')
    list_filter = ('status', 'document_type', 'submitted_at', 'reviewed_at')
    search_fields = ('member__member_id', 'member__full_name', 'document_number', 'admin_remarks')
    raw_id_fields = ('member',)
    ordering = ('-submitted_at',)
    readonly_fields = ('submitted_at', 'reviewed_at')

    @admin.display(description='Member')
    def member_id_display(self, obj):
        return f"{obj.member.member_id} ({obj.member.full_name})"
