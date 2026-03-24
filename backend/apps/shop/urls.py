"""Shop URLs — /api/shop/"""
from django.urls import path
from .views import ShopStatusView

urlpatterns = [
    path('status/', ShopStatusView.as_view(), name='shop-status'),
]
