"""Sales repository."""
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from .models import Sale


class SaleRepository:
    @staticmethod
    def get_all():
        return Sale.objects.select_related('product', 'sold_by', 'customer').all()

    @staticmethod
    def get_by_id(sale_id):
        return Sale.objects.filter(id=sale_id).first()

    @staticmethod
    def create(data):
        return Sale.objects.create(**data)

    @staticmethod
    def get_daily_summary(date):
        return Sale.objects.filter(
            created_at__date=date
        ).aggregate(
            total_sales=Count('id'),
            total_revenue=Sum('total_amount'),
            total_profit=Sum('profit'),
            total_quantity=Sum('quantity'),
        )

    @staticmethod
    def get_sales_by_date_range(start_date, end_date):
        return Sale.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        ).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            total_revenue=Sum('total_amount'),
            total_profit=Sum('profit'),
            total_quantity=Sum('quantity'),
            sale_count=Count('id'),
        ).order_by('date')

    @staticmethod
    def get_product_sales_comparison(start_date, end_date):
        return Sale.objects.filter(
            created_at__date__gte=start_date,
            created_at__date__lte=end_date
        ).values('product__name', 'product__price').annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum('total_amount'),
            total_profit=Sum('profit'),
        ).order_by('product__price')
