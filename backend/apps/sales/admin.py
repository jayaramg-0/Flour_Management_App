from django.contrib import admin
from .models import Sale

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'quantity', 'total_amount', 'profit', 'created_at']
    list_filter = ['product', 'created_at']
