"""Inventory repository — DB access layer."""
from .models import Product, Inventory


class ProductRepository:
    @staticmethod
    def get_all():
        return Product.objects.all()

    @staticmethod
    def get_active():
        return Product.objects.filter(is_active=True)

    @staticmethod
    def get_by_id(product_id):
        return Product.objects.filter(id=product_id).first()

    @staticmethod
    def create(data):
        return Product.objects.create(**data)

    @staticmethod
    def delete(product_id):
        product = Product.objects.filter(id=product_id).first()
        if product:
            product.delete()
            return True
        return False


class InventoryRepository:
    @staticmethod
    def get_all():
        return Inventory.objects.select_related('product').all()

    @staticmethod
    def get_by_product(product_id):
        return Inventory.objects.filter(product_id=product_id).first()

    @staticmethod
    def get_or_create(product):
        obj, created = Inventory.objects.get_or_create(product=product, defaults={'quantity': 0})
        return obj

    @staticmethod
    def update_quantity(inventory, quantity):
        inventory.quantity = quantity
        inventory.save()
        return inventory
