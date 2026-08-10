from django.urls import path
from .views import BinaryTreeView, ReferralTreeView

urlpatterns = [
    path('binary/', BinaryTreeView.as_view(), name='binary_tree'),
    path('referrals/', ReferralTreeView.as_view(), name='referral_tree'),
]
