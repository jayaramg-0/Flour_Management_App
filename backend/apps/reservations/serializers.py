"""Reservation serializers."""
from rest_framework import serializers
from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'user_name', 'product', 'product_name', 'product_price',
            'quantity', 'total_amount', 'status', 'created_at', 'updated_at', 'expires_at'
        ]
        read_only_fields = ['id', 'user', 'total_amount', 'created_at', 'updated_at']


class CreateReservationSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
