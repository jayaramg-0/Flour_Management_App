"""Inventory service — business logic."""
from rest_framework.exceptions import ValidationError
from .repositories import ProductRepository, InventoryRepository


class InventoryService:
    @staticmethod
    def get_all_products():
        return ProductRepository.get_all()

    @staticmethod
    def get_active_products():
        return ProductRepository.get_active()

    @staticmethod
    def get_product(product_id):
        return ProductRepository.get_by_id(product_id)

    @staticmethod
    def create_product(validated_data):
        product = ProductRepository.create(validated_data)
        # Auto-create inventory entry
        InventoryRepository.get_or_create(product)
        return product

    @staticmethod
    def delete_product(product_id):
        return ProductRepository.delete(product_id)

    @staticmethod
    def get_all_inventory():
        return InventoryRepository.get_all()

    @staticmethod
    def get_stock_status():
        """Get stock levels with low-stock alerts."""
        inventories = InventoryRepository.get_all()
        return inventories

    @staticmethod
    def update_stock(product_id, quantity, action):
        """Add or remove stock for a product."""
        inventory = InventoryRepository.get_by_product(product_id)
        if not inventory:
            raise ValidationError('Inventory not found for this product.')

        if action == 'add':
            new_qty = inventory.quantity + quantity
        elif action == 'remove':
            if inventory.quantity < quantity:
                raise ValidationError(f'Insufficient stock. Available: {inventory.quantity}')
            new_qty = inventory.quantity - quantity
        else:
            raise ValidationError('Invalid action. Use "add" or "remove".')

        return InventoryRepository.update_quantity(inventory, new_qty)

    @staticmethod
    def check_and_reduce_stock(product_id, quantity):
        """Reduce stock after a sale or reservation. Returns True if successful."""
        inventory = InventoryRepository.get_by_product(product_id)
        if not inventory or inventory.quantity < quantity:
            raise ValidationError(f'Insufficient stock. Available: {inventory.quantity if inventory else 0}')
        inventory.quantity -= quantity
        inventory.save()
        return True

    @staticmethod
    def restore_stock(product_id, quantity):
        """Restore stock when a reservation is cancelled."""
        inventory = InventoryRepository.get_by_product(product_id)
        if inventory:
            inventory.quantity += quantity
            inventory.save()
