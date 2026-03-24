"""Sales URLs — /api/sales/"""
from django.urls import path
from .views import SaleListCreateView, DailySalesView, ProfitLossView

urlpatterns = [
    path('', SaleListCreateView.as_view(), name='sale-list'),
    path('daily/', DailySalesView.as_view(), name='daily-sales'),
    path('profit-loss/', ProfitLossView.as_view(), name='profit-loss'),
]
