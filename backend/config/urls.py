"""
Main URL Configuration for Flour Shop Management System.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    """Root API view providing a welcome message and endpoint list."""
    return JsonResponse({
        "message": "Welcome to the Flour Shop Management System API",
        "status": "running",
        "endpoints": {
            "admin": "/admin/",
            "auth": "/api/auth/",
            "users": "/api/users/",
            "products": "/api/products/",
            "inventory": "/api/inventory/",
            "sales": "/api/sales/",
            "reservations": "/api/reservations/",
            "payments": "/api/payments/",
            "debts": "/api/debts/",
            "feedback": "/api/feedback/",
            "shop": "/api/shop/",
            "analytics": "/api/analytics/"
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/users/', include('apps.users.user_urls')),
    path('api/products/', include('apps.inventory.product_urls')),
    path('api/inventory/', include('apps.inventory.urls')),
    path('api/sales/', include('apps.sales.urls')),
    path('api/reservations/', include('apps.reservations.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/debts/', include('apps.payments.debt_urls')),
    path('api/feedback/', include('apps.feedback.urls')),
    path('api/shop/', include('apps.shop.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
]
