from django.contrib import admin
from .models import ShopStatus

@admin.register(ShopStatus)
class ShopStatusAdmin(admin.ModelAdmin):
    list_display = ['is_open', 'updated_by', 'updated_at']
