from django.contrib import admin
from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'product', 'quantity', 'status', 'created_at']
    list_filter = ['status']
