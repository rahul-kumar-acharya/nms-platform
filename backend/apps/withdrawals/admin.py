from django.contrib import admin
from .models import Withdrawal

@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id_display', 'amount', 'status', 'bank_account_no', 'ifsc_code', 'upi_id', 'created_at', 'processed_at')
    list_filter = ('status', 'created_at', 'processed_at')
    search_fields = ('member__member_id', 'member__full_name', 'bank_account_no', 'ifsc_code', 'upi_id', 'admin_notes')
    raw_id_fields = ('member',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'processed_at')

    @admin.display(description='Member')
    def member_id_display(self, obj):
        return f"{obj.member.member_id} ({obj.member.full_name})"
