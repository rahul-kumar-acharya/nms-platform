from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email', 'role', 'mobile', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('role', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'mobile', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('NMS System Role & Details', {'fields': ('role', 'mobile')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('NMS System Role & Details', {'fields': ('role', 'mobile')}),
    )
