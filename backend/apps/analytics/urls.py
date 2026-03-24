"""Analytics URLs — /api/analytics/"""
from django.urls import path
from .views import SalesAnalyticsView, ProfitAnalyticsView, ComparisonAnalyticsView

urlpatterns = [
    path('sales/', SalesAnalyticsView.as_view(), name='analytics-sales'),
    path('profit/', ProfitAnalyticsView.as_view(), name='analytics-profit'),
    path('comparison/', ComparisonAnalyticsView.as_view(), name='analytics-comparison'),
]
