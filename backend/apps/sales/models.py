"""
Sales model for tracking each transaction.
"""
from django.db import models
from django.conf import settings


class Sale(models.Model):
    """Individual sale transaction."""
    product = models.ForeignKey('inventory.Product', on_delete=models.PROTECT, related_name='sales')
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    profit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sold_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='sales_made')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='purchases')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sales'
        ordering = ['-created_at']

    def __str__(self):
        return f"Sale #{self.id}: {self.quantity}x {self.product.name} = ₹{self.total_amount}"

    def save(self, *args, **kwargs):
        self.total_amount = self.unit_price * self.quantity
        self.profit = (self.unit_price - self.cost_price) * self.quantity
        super().save(*args, **kwargs)
