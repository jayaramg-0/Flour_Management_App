"""
Reservation model for customer packet pre-booking.
"""
from django.db import models
from django.conf import settings


class Reservation(models.Model):
    """Customer reservation / pre-booking of flour packets."""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    product = models.ForeignKey('inventory.Product', on_delete=models.CASCADE, related_name='reservations')
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'reservations'
        ordering = ['-created_at']

    def __str__(self):
        return f"Reservation #{self.id}: {self.user.username} - {self.quantity}x {self.product.name} ({self.status})"

    def save(self, *args, **kwargs):
        self.total_amount = self.product.price * self.quantity
        super().save(*args, **kwargs)
