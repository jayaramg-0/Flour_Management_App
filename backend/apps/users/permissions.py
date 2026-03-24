"""
Custom permissions for role-based access control.
"""
from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """Allow access only to users with 'owner' role."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'owner'


class IsCustomer(BasePermission):
    """Allow access only to users with 'customer' role."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'customer'


class IsOwnerOrReadOnly(BasePermission):
    """Owner has full access; others are read-only."""
    def has_permission(self, request, view):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.role == 'owner'
