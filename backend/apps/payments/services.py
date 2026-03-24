"""Debt service — business logic."""
from rest_framework.exceptions import ValidationError
from .models import Payment, Debt


class DebtService:
    @staticmethod
    def create_debt(customer_id, sale, total_amount, amount_paid):
        """Create a debt record for partial payment."""
        debt = Debt.objects.create(
            customer_id=customer_id,
            sale=sale,
            total_amount=total_amount,
            amount_paid=amount_paid,
            status='partial' if amount_paid > 0 else 'pending',
        )
        return debt

    @staticmethod
    def get_all_debts():
        return Debt.objects.select_related('customer', 'sale').exclude(status='paid')

    @staticmethod
    def get_all_debts_including_paid():
        return Debt.objects.select_related('customer', 'sale').all()

    @staticmethod
    def get_debt(debt_id):
        return Debt.objects.filter(id=debt_id).first()

    @staticmethod
    def record_payment(data):
        """Record a payment against an existing debt."""
        debt = Debt.objects.filter(id=data['debt_id']).first()
        if not debt:
            raise ValidationError('Debt not found.')
        if debt.status == 'paid':
            raise ValidationError('Debt is already fully paid.')

        amount = data['amount']
        remaining = debt.amount_remaining

        if amount > remaining:
            raise ValidationError(f'Amount exceeds remaining debt of ₹{remaining}.')

        # Record payment
        Payment.objects.create(
            sale=debt.sale,
            customer=debt.customer,
            amount=amount,
            payment_method=data.get('payment_method', 'cash'),
            notes=data.get('notes', ''),
        )

        # Update debt
        debt.amount_paid += amount
        if debt.amount_remaining <= 0:
            debt.status = 'paid'
        else:
            debt.status = 'partial'
        debt.save()

        return debt

    @staticmethod
    def get_customer_debts(customer_id):
        return Debt.objects.filter(customer_id=customer_id).exclude(status='paid')
