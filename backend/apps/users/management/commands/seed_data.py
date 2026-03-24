"""
Seed data management command.
Creates sample data for development/testing.
"""
import random
from datetime import timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.users.models import User
from apps.inventory.models import Product, Inventory
from apps.sales.models import Sale
from apps.reservations.models import Reservation
from apps.payments.models import Payment, Debt
from apps.feedback.models import Feedback
from apps.shop.models import ShopStatus


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('🌱 Seeding database...\n')

        # 1. Create Users
        owner, created = User.objects.get_or_create(
            email='owner@flourshop.com',
            defaults={
                'username': 'owner',
                'role': 'owner',
                'first_name': 'Shop',
                'last_name': 'Owner',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            owner.set_password('owner123')
            owner.save()
            self.stdout.write(self.style.SUCCESS('✅ Owner created: owner@flourshop.com / owner123'))
        else:
            self.stdout.write('  Owner already exists.')

        customer, created = User.objects.get_or_create(
            email='customer@flourshop.com',
            defaults={
                'username': 'customer1',
                'role': 'customer',
                'first_name': 'Test',
                'last_name': 'Customer',
                'phone': '9876543210',
            }
        )
        if created:
            customer.set_password('customer123')
            customer.save()
            self.stdout.write(self.style.SUCCESS('✅ Customer created: customer@flourshop.com / customer123'))
        else:
            self.stdout.write('  Customer already exists.')

        # Create additional customers
        for i in range(2, 5):
            u, created = User.objects.get_or_create(
                email=f'customer{i}@flourshop.com',
                defaults={
                    'username': f'customer{i}',
                    'role': 'customer',
                    'first_name': f'Customer',
                    'last_name': f'{i}',
                    'phone': f'987654321{i}',
                }
            )
            if created:
                u.set_password('customer123')
                u.save()

        # 2. Create Products
        product_20, _ = Product.objects.get_or_create(
            name='₹20 Flour Packet',
            defaults={
                'price': Decimal('20.00'),
                'cost_price': Decimal('15.00'),
                'description': 'Standard 500g flour packet',
            }
        )

        product_30, _ = Product.objects.get_or_create(
            name='₹30 Flour Packet',
            defaults={
                'price': Decimal('30.00'),
                'cost_price': Decimal('22.00'),
                'description': 'Premium 1kg flour packet',
            }
        )
        self.stdout.write(self.style.SUCCESS('✅ Products created'))

        # 3. Create Inventory
        inv_20, _ = Inventory.objects.get_or_create(product=product_20, defaults={'quantity': 150, 'low_stock_threshold': 10})
        inv_30, _ = Inventory.objects.get_or_create(product=product_30, defaults={'quantity': 100, 'low_stock_threshold': 10})
        self.stdout.write(self.style.SUCCESS('✅ Inventory created'))

        # 4. Create sample Sales (last 30 days)
        customers = list(User.objects.filter(role='customer'))
        products = [product_20, product_30]
        now = timezone.now()

        if Sale.objects.count() == 0:
            for day_offset in range(30, 0, -1):
                sale_date = now - timedelta(days=day_offset)
                num_sales = random.randint(2, 8)
                for _ in range(num_sales):
                    product = random.choice(products)
                    qty = random.randint(1, 10)
                    Sale.objects.create(
                        product=product,
                        quantity=qty,
                        unit_price=product.price,
                        cost_price=product.cost_price,
                        sold_by=owner,
                        customer=random.choice(customers) if random.random() > 0.3 else None,
                        created_at=sale_date + timedelta(hours=random.randint(8, 20)),
                    )
            self.stdout.write(self.style.SUCCESS('✅ Sample sales created (30 days)'))

        # 5. Create sample Reservations
        if Reservation.objects.count() == 0:
            for c in customers[:3]:
                product = random.choice(products)
                Reservation.objects.create(
                    user=c,
                    product=product,
                    quantity=random.randint(1, 5),
                    status=random.choice(['pending', 'confirmed', 'completed']),
                    expires_at=now + timedelta(hours=24),
                )
            self.stdout.write(self.style.SUCCESS('✅ Sample reservations created'))

        # 6. Create sample Debts
        if Debt.objects.count() == 0:
            for c in customers[:2]:
                sale = Sale.objects.filter(customer=c).first()
                if sale:
                    total = Decimal('100.00')
                    paid = Decimal(str(random.choice([0, 30, 50, 70])))
                    Debt.objects.create(
                        customer=c,
                        sale=sale,
                        total_amount=total,
                        amount_paid=paid,
                        status='partial' if 0 < paid < total else ('paid' if paid >= total else 'pending'),
                        description='Previous purchase balance',
                    )
            self.stdout.write(self.style.SUCCESS('✅ Sample debts created'))

        # 7. Create sample Feedback
        if Feedback.objects.count() == 0:
            comments = [
                'Great quality flour!', 'Very fresh and good packaging.',
                'Nice shop, will come again.', 'Good prices and service.',
                'Excellent flour, perfect for making rotis.',
            ]
            for i, c in enumerate(customers):
                Feedback.objects.create(
                    user=c,
                    rating=random.randint(3, 5),
                    comment=comments[i % len(comments)],
                )
            self.stdout.write(self.style.SUCCESS('✅ Sample feedback created'))

        # 8. Set shop as open
        ShopStatus.objects.update_or_create(pk=1, defaults={'is_open': True, 'updated_by': owner})
        self.stdout.write(self.style.SUCCESS('✅ Shop set to Open'))

        self.stdout.write(self.style.SUCCESS('\n🎉 Database seeded successfully!'))
