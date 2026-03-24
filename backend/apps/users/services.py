"""
User service — business logic layer.
"""
from rest_framework_simplejwt.tokens import RefreshToken
from .repositories import UserRepository


class UserService:
    @staticmethod
    def register_user(serializer):
        """Register and return user with JWT tokens."""
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }

    @staticmethod
    def login_user(user):
        """Generate JWT tokens for authenticated user."""
        refresh = RefreshToken.for_user(user)
        return {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }

    @staticmethod
    def get_all_users():
        return UserRepository.get_all()

    @staticmethod
    def get_user_by_id(user_id):
        return UserRepository.get_by_id(user_id)

    @staticmethod
    def delete_user(user_id):
        return UserRepository.delete_user(user_id)
