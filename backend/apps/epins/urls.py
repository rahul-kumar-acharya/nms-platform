from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EPINViewSet

router = DefaultRouter()
router.register(r'', EPINViewSet, basename='epin')

urlpatterns = [
    path('', include(router.urls)),
]
