"""
Payment and Debt models for tracking customer payments.
"""
from django.db import models
from django.conf import settings


class Payment(models.Model):
    """Record of a payment made by a customer."""
    METHOD_CHOICES = (
        ('cash', 'Cash'),
        ('upi', 'UPI'),
        ('card', 'Card'),
        ('other', 'Other'),
    )
    sale = models.ForeignKey('sales.Sale', on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=METHOD_CHOICES, default='cash')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment ₹{self.amount} by {self.customer.username}"


class Debt(models.Model):
    """Tracks outstanding customer debts."""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('partial', 'Partially Paid'),
        ('paid', 'Fully Paid'),
    )
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='debts')
    sale = models.ForeignKey('sales.Sale', on_delete=models.CASCADE, related_name='debts', null=True, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'debts'
        ordering = ['-created_at']

    def __str__(self):
        return f"Debt: {self.customer.username} owes ₹{self.amount_remaining}"

    @property
    def amount_remaining(self):
        return self.total_amount - self.amount_paid
