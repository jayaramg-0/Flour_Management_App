from django.contrib import admin
from .models import Payment, Debt

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'amount', 'payment_method', 'created_at']

@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'total_amount', 'amount_paid', 'status']
    list_filter = ['status']
