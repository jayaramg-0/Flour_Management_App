"""
Shop status model for open/close toggle.
"""
from django.db import models
from django.conf import settings


class ShopStatus(models.Model):
    """Singleton model tracking shop open/close status."""
    is_open = models.BooleanField(default=False)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shop_status'
        verbose_name_plural = 'Shop Status'

    def __str__(self):
        return f"Shop is {'Open' if self.is_open else 'Closed'}"

    def save(self, *args, **kwargs):
        # Ensure only one instance (singleton)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_status(cls):
        obj, _ = cls.objects.get_or_create(pk=1, defaults={'is_open': False})
        return obj
