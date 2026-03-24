"""Shop status serializer."""
from rest_framework import serializers
from .models import ShopStatus


class ShopStatusSerializer(serializers.ModelSerializer):
    updated_by_name = serializers.CharField(source='updated_by.username', read_only=True, default=None)

    class Meta:
        model = ShopStatus
        fields = ['id', 'is_open', 'updated_by', 'updated_by_name', 'updated_at']
        read_only_fields = ['id', 'updated_by', 'updated_at']
