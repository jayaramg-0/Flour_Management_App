"""Sales service — business logic."""
from rest_framework.exceptions import ValidationError
from apps.inventory.services import InventoryService
from apps.inventory.repositories import ProductRepository
from .repositories import SaleRepository


class SalesService:
    @staticmethod
    def create_sale(data, sold_by):
        """Create a sale, reduce stock, and optionally track debt."""
        product = ProductRepository.get_by_id(data['product_id'])
        if not product:
            raise ValidationError('Product not found.')
        if not product.is_active:
            raise ValidationError('Product is not available.')

        # Reduce stock
        InventoryService.check_and_reduce_stock(product.id, data['quantity'])

        # Create sale record
        sale = SaleRepository.create({
            'product': product,
            'quantity': data['quantity'],
            'unit_price': product.price,
            'cost_price': product.cost_price,
            'sold_by': sold_by,
            'customer_id': data.get('customer_id'),
            'notes': data.get('notes', ''),
        })

        # Handle payment / debt
        total = sale.total_amount
        amount_paid = data.get('amount_paid')

        if amount_paid is not None and data.get('customer_id'):
            from apps.payments.services import DebtService
            if amount_paid < total:
                # Partial payment — create debt
                DebtService.create_debt(
                    customer_id=data['customer_id'],
                    sale=sale,
                    total_amount=total,
                    amount_paid=amount_paid,
                )
            # Record payment
            if amount_paid > 0:
                from apps.payments.models import Payment
                Payment.objects.create(
                    sale=sale,
                    customer_id=data['customer_id'],
                    amount=amount_paid,
                    payment_method=data.get('payment_method', 'cash'),
                )

        return sale

    @staticmethod
    def get_all_sales():
        return SaleRepository.get_all()

    @staticmethod
    def get_daily_summary(date):
        return SaleRepository.get_daily_summary(date)

    @staticmethod
    def get_sales_by_range(start_date, end_date):
        return SaleRepository.get_sales_by_date_range(start_date, end_date)

    @staticmethod
    def get_product_comparison(start_date, end_date):
        return SaleRepository.get_product_sales_comparison(start_date, end_date)
