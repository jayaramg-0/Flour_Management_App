"""Sales views — API controllers."""
from datetime import date, timedelta
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.users.permissions import IsOwner
from .serializers import SaleSerializer, CreateSaleSerializer
from .services import SalesService


class SaleListCreateView(APIView):
    """GET/POST /api/sales/"""
    permission_classes = [IsOwner]

    def get(self, request):
        sales = SalesService.get_all_sales()
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateSaleSerializer(data=request.data)
        if serializer.is_valid():
            try:
                sale = SalesService.create_sale(serializer.validated_data, request.user)
                return Response(SaleSerializer(sale).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DailySalesView(APIView):
    """GET /api/sales/daily/ — Today's summary."""
    permission_classes = [IsOwner]

    def get(self, request):
        target_date = request.query_params.get('date', date.today().isoformat())
        summary = SalesService.get_daily_summary(target_date)
        summary['date'] = target_date
        # Fill nulls with 0
        for key in ['total_sales', 'total_revenue', 'total_profit', 'total_quantity']:
            if summary[key] is None:
                summary[key] = 0
        return Response(summary)


class ProfitLossView(APIView):
    """GET /api/sales/profit-loss/ — Profit & loss report."""
    permission_classes = [IsOwner]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start = date.today() - timedelta(days=days)
        end = date.today()
        data = SalesService.get_sales_by_range(start, end)
        total_revenue = sum(d['total_revenue'] or 0 for d in data)
        total_profit = sum(d['total_profit'] or 0 for d in data)
        total_cost = total_revenue - total_profit
        return Response({
            'period_days': days,
            'start_date': start.isoformat(),
            'end_date': end.isoformat(),
            'total_revenue': total_revenue,
            'total_cost': total_cost,
            'total_profit': total_profit,
            'daily_breakdown': list(data),
        })
