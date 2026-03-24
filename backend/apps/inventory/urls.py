"""Inventory URLs — /api/inventory/"""
from django.urls import path
from .views import InventoryListView, StockUpdateView, StockStatusView

urlpatterns = [
    path('', InventoryListView.as_view(), name='inventory-list'),
    path('<int:pk>/update-stock/', StockUpdateView.as_view(), name='stock-update'),
    path('status/', StockStatusView.as_view(), name='stock-status'),
]
