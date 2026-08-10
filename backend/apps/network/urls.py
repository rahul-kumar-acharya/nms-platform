from django.urls import path, re_path
from .views import BinaryTreeView, ReferralTreeView

urlpatterns = [
    re_path(r'^binary/?$', BinaryTreeView.as_view(), name='binary_tree'),
    re_path(r'^referrals/?$', ReferralTreeView.as_view(), name='referral_tree'),
]
