"""Reservation service."""
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError
from apps.inventory.services import InventoryService
from apps.inventory.repositories import ProductRepository
from .models import Reservation


class ReservationService:
    @staticmethod
    def create_reservation(user, data):
        product = ProductRepository.get_by_id(data['product_id'])
        if not product or not product.is_active:
            raise ValidationError('Product not found or not available.')

        # Check and reduce stock
        InventoryService.check_and_reduce_stock(product.id, data['quantity'])

        reservation = Reservation.objects.create(
            user=user,
            product=product,
            quantity=data['quantity'],
            status='pending',
            expires_at=timezone.now() + timedelta(hours=24),
        )
        return reservation

    @staticmethod
    def get_user_reservations(user):
        return Reservation.objects.filter(user=user).select_related('product')

    @staticmethod
    def get_all_reservations():
        return Reservation.objects.select_related('user', 'product').all()

    @staticmethod
    def cancel_reservation(reservation_id, user):
        reservation = Reservation.objects.filter(id=reservation_id).first()
        if not reservation:
            raise ValidationError('Reservation not found.')
        if reservation.user != user and user.role != 'owner':
            raise ValidationError('Permission denied.')
        if reservation.status in ('cancelled', 'completed'):
            raise ValidationError(f'Reservation already {reservation.status}.')

        reservation.status = 'cancelled'
        reservation.save()
        # Restore stock
        InventoryService.restore_stock(reservation.product_id, reservation.quantity)
        return reservation

    @staticmethod
    def complete_reservation(reservation_id):
        reservation = Reservation.objects.filter(id=reservation_id).first()
        if not reservation:
            raise ValidationError('Reservation not found.')
        reservation.status = 'completed'
        reservation.save()
        return reservation

    @staticmethod
    def confirm_reservation(reservation_id):
        reservation = Reservation.objects.filter(id=reservation_id).first()
        if not reservation:
            raise ValidationError('Reservation not found.')
        reservation.status = 'confirmed'
        reservation.save()
        return reservation
