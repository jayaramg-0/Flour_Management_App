"""
User repository — database access layer.
"""
from .models import User


class UserRepository:
    @staticmethod
    def get_all():
        return User.objects.all()

    @staticmethod
    def get_by_id(user_id):
        return User.objects.filter(id=user_id).first()

    @staticmethod
    def get_by_email(email):
        return User.objects.filter(email=email).first()

    @staticmethod
    def get_customers():
        return User.objects.filter(role='customer')

    @staticmethod
    def get_owners():
        return User.objects.filter(role='owner')

    @staticmethod
    def delete_user(user_id):
        user = User.objects.filter(id=user_id).first()
        if user:
            user.delete()
            return True
        return False
