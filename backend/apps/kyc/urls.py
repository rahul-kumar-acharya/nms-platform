from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KYCDocumentViewSet

router = DefaultRouter()
router.register(r'', KYCDocumentViewSet, basename='kyc')

urlpatterns = [
    path('', include(router.urls)),
]
