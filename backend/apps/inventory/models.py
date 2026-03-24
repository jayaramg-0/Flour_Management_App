"""
Product and Inventory models.
"""
from django.db import models


class Product(models.Model):
    """Flour packet product (e.g., ₹20 packet, ₹30 packet)."""
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Selling price per packet")
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Cost price per packet")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        ordering = ['price']

    def __str__(self):
        return f"{self.name} - ₹{self.price}"

    @property
    def profit_per_unit(self):
        return self.price - self.cost_price


class Inventory(models.Model):
    """Stock tracking for each product."""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='inventory')
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory'
        verbose_name_plural = 'Inventory'

    def __str__(self):
        return f"{self.product.name}: {self.quantity} units"

    @property
    def is_low_stock(self):
        return self.quantity <= self.low_stock_threshold
