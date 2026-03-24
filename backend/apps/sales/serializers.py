"""Sales serializers."""
from rest_framework import serializers
from .models import Sale


class SaleSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    sold_by_name = serializers.CharField(source='sold_by.username', read_only=True, default=None)
    customer_name = serializers.CharField(source='customer.username', read_only=True, default=None)

    class Meta:
        model = Sale
        fields = [
            'id', 'product', 'product_name', 'quantity', 'unit_price', 'cost_price',
            'total_amount', 'profit', 'sold_by', 'sold_by_name', 'customer',
            'customer_name', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'total_amount', 'profit', 'sold_by', 'created_at']


class CreateSaleSerializer(serializers.Serializer):
    """DTO for creating a sale."""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    customer_id = serializers.IntegerField(required=False, allow_null=True)
    amount_paid = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, default=None)
    payment_method = serializers.ChoiceField(choices=['cash', 'upi', 'card', 'other'], default='cash')
    notes = serializers.CharField(required=False, allow_blank=True, default='')
