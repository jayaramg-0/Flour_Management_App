"""Debt URLs — /api/debts/"""
from django.urls import path
from .views import DebtListView, DebtDetailView

urlpatterns = [
    path('', DebtListView.as_view(), name='debt-list'),
    path('<int:pk>/', DebtDetailView.as_view(), name='debt-detail'),
]
