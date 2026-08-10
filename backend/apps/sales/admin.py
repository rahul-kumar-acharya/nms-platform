from django.contrib import admin
from .models import Product, Order

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    ordering = ('id',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id_display', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('member__member_id', 'member__full_name')
    raw_id_fields = ('member',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

    @admin.display(description='Member')
    def member_id_display(self, obj):
        return f"{obj.member.member_id} ({obj.member.full_name})"
