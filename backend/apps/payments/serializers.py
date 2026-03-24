"""Payment and Debt serializers."""
from rest_framework import serializers
from .models import Payment, Debt


class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'sale', 'customer', 'customer_name', 'amount', 'payment_method', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']


class DebtSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    amount_remaining = serializers.ReadOnlyField()

    class Meta:
        model = Debt
        fields = [
            'id', 'customer', 'customer_name', 'customer_email', 'sale',
            'total_amount', 'amount_paid', 'amount_remaining', 'status',
            'description', 'due_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'amount_remaining', 'created_at', 'updated_at']


class RecordPaymentSerializer(serializers.Serializer):
    """DTO for recording a payment against a debt."""
    debt_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0.01)
    payment_method = serializers.ChoiceField(choices=['cash', 'upi', 'card', 'other'], default='cash')
    notes = serializers.CharField(required=False, allow_blank=True, default='')
