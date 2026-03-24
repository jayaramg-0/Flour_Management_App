from django.contrib import admin
from .models import Product, Inventory

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'cost_price', 'is_active']

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity', 'low_stock_threshold', 'is_low_stock']
