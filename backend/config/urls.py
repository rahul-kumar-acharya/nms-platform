from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # NMS System APIs v1
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/members/', include('apps.members.urls')),
    path('api/v1/plans/', include('apps.plans.urls')),
    path('api/v1/epins/', include('apps.epins.urls')),
    path('api/v1/network/', include('apps.network.urls')),
    path('api/v1/income/', include('apps.income.urls')),
    path('api/v1/wallet/', include('apps.wallet.urls')),
    path('api/v1/withdrawals/', include('apps.withdrawals.urls')),
    path('api/v1/kyc/', include('apps.kyc.urls')),
    path('api/v1/support/', include('apps.support.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/audit/', include('apps.audit.urls')),
]
