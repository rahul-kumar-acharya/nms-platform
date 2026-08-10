from django.contrib import admin
from .models import Member

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id', 'full_name', 'mobile', 'sponsor_id_display', 'parent_id_display', 'position', 'current_plan', 'status', 'kyc_status', 'joining_date')
    list_filter = ('status', 'kyc_status', 'position', 'is_root', 'current_plan', 'joining_date')
    search_fields = ('member_id', 'full_name', 'mobile', 'user__username', 'user__email', 'sponsor__member_id', 'parent__member_id')
    raw_id_fields = ('user', 'sponsor', 'parent')
    ordering = ('-joining_date',)
    readonly_fields = ('joining_date',)

    @admin.display(description='Sponsor ID')
    def sponsor_id_display(self, obj):
        return obj.sponsor.member_id if obj.sponsor else '-'

    @admin.display(description='Parent ID')
    def parent_id_display(self, obj):
        return obj.parent.member_id if obj.parent else '-'
