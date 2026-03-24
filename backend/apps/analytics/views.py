"""Analytics views — chart data endpoints."""
from datetime import date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.users.permissions import IsOwner
from apps.sales.services import SalesService


class SalesAnalyticsView(APIView):
    """GET /api/analytics/sales/ — Daily sales chart data."""
    permission_classes = [IsOwner]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start = date.today() - timedelta(days=days)
        end = date.today()
        data = SalesService.get_sales_by_range(start, end)
        chart_data = {
            'labels': [d['date'].isoformat() if hasattr(d['date'], 'isoformat') else str(d['date']) for d in data],
            'revenue': [float(d['total_revenue'] or 0) for d in data],
            'quantity': [int(d['total_quantity'] or 0) for d in data],
            'sale_count': [int(d['sale_count'] or 0) for d in data],
        }
        return Response(chart_data)


class ProfitAnalyticsView(APIView):
    """GET /api/analytics/profit/ — Profit chart data."""
    permission_classes = [IsOwner]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start = date.today() - timedelta(days=days)
        end = date.today()
        data = SalesService.get_sales_by_range(start, end)
        chart_data = {
            'labels': [d['date'].isoformat() if hasattr(d['date'], 'isoformat') else str(d['date']) for d in data],
            'profit': [float(d['total_profit'] or 0) for d in data],
            'revenue': [float(d['total_revenue'] or 0) for d in data],
        }
        return Response(chart_data)


class ComparisonAnalyticsView(APIView):
    """GET /api/analytics/comparison/ — Product comparison chart data."""
    permission_classes = [IsOwner]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start = date.today() - timedelta(days=days)
        end = date.today()
        data = SalesService.get_product_comparison(start, end)
        chart_data = {
            'labels': [d['product__name'] for d in data],
            'quantities': [int(d['total_quantity'] or 0) for d in data],
            'revenue': [float(d['total_revenue'] or 0) for d in data],
            'profit': [float(d['total_profit'] or 0) for d in data],
        }
        return Response(chart_data)
