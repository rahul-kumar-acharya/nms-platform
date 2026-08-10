from django.contrib import admin
from .models import IncomeTransaction

@admin.register(IncomeTransaction)
class IncomeTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id_display', 'type', 'amount', 'source_member_display', 'created_at', 'description')
    list_filter = ('type', 'created_at')
    search_fields = ('member__member_id', 'member__full_name', 'source_member__member_id', 'description')
    raw_id_fields = ('member', 'source_member')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

    @admin.display(description='Member ID')
    def member_id_display(self, obj):
        return f"{obj.member.member_id} ({obj.member.full_name})"

    @admin.display(description='Source Member')
    def source_member_display(self, obj):
        return f"{obj.source_member.member_id}" if obj.source_member else '-'
