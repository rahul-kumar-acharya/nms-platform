from django.contrib import admin
from .models import SupportTicket, TicketMessage

class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 1
    raw_id_fields = ('sender',)
    readonly_fields = ('created_at',)

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id_display', 'subject', 'category', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'category', 'created_at', 'updated_at')
    search_fields = ('subject', 'member__member_id', 'member__full_name', 'category')
    raw_id_fields = ('member',)
    ordering = ('-updated_at',)
    readonly_fields = ('created_at', 'updated_at')
    inlines = [TicketMessageInline]

    @admin.display(description='Member')
    def member_id_display(self, obj):
        return f"{obj.member.member_id} ({obj.member.full_name})"

@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'ticket', 'sender', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('ticket__subject', 'sender__username', 'message')
    raw_id_fields = ('ticket', 'sender')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
