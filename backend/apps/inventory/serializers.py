"""Inventory serializers (DTOs)."""
from rest_framework import serializers
from .models import Product, Inventory


class ProductSerializer(serializers.ModelSerializer):
    profit_per_unit = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'cost_price', 'description', 'is_active', 'profit_per_unit', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Inventory
        fields = ['id', 'product', 'product_name', 'product_price', 'quantity', 'low_stock_threshold', 'is_low_stock', 'last_updated']
        read_only_fields = ['id', 'last_updated']


class StockUpdateSerializer(serializers.Serializer):
    """DTO for adding/removing stock."""
    quantity = serializers.IntegerField()
    action = serializers.ChoiceField(choices=['add', 'remove'])
