from django.contrib import admin
from .models import EPIN

@admin.register(EPIN)
class EPINAdmin(admin.ModelAdmin):
    list_display = ('id', 'code', 'plan', 'status', 'created_by', 'used_by_display', 'created_at', 'used_at')
    list_filter = ('status', 'plan', 'created_at', 'used_at')
    search_fields = ('code', 'plan__name', 'used_by__member_id', 'used_by__full_name', 'created_by__username')
    raw_id_fields = ('created_by', 'used_by')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'used_at')

    @admin.display(description='Used By Member')
    def used_by_display(self, obj):
        return f"{obj.used_by.member_id} ({obj.used_by.full_name})" if obj.used_by else '-'
