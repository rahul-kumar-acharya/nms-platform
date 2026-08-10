from django.contrib import admin
from .models import Wallet, WalletTransaction

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id_display', 'current_balance_display', 'total_earnings_display', 'updated_at')
    search_fields = ('member__member_id', 'member__full_name')
    raw_id_fields = ('member',)
    readonly_fields = ('updated_at',)

    @admin.display(description='Member')
    def member_id_display(self, obj):
        return f"{obj.member.member_id} ({obj.member.full_name})"

    @admin.display(description='Current Balance (₹)')
    def current_balance_display(self, obj):
        return f"₹{obj.get_balance():,.2f}"

    @admin.display(description='Total Earnings (₹)')
    def total_earnings_display(self, obj):
        return f"₹{obj.get_total_earnings():,.2f}"

@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'member_id_display', 'type', 'category', 'amount', 'balance_after', 'reference_id', 'created_at')
    list_filter = ('type', 'category', 'created_at')
    search_fields = ('wallet__member__member_id', 'wallet__member__full_name', 'reference_id', 'description')
    raw_id_fields = ('wallet',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

    @admin.display(description='Member')
    def member_id_display(self, obj):
        return f"{obj.wallet.member.member_id}"
