"""
User views — API endpoints (Controllers).
"""
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    UserSerializer, UserUpdateSerializer
)
from .services import UserService
from .permissions import IsOwner


class RegisterView(APIView):
    """POST /api/auth/register/ — Register new user."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            result = UserService.register_user(serializer)
            return Response(result, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """POST /api/auth/login/ — Login with email/password."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            result = UserService.login_user(user)
            return Response(result, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """GET /api/auth/profile/ — Get current user profile."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserListView(generics.ListAPIView):
    """GET /api/users/ — List all users (owner only)."""
    serializer_class = UserSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return UserService.get_all_users()


class UserDetailView(APIView):
    """GET/PUT/DELETE /api/users/<id>/ — Manage specific user (owner only)."""
    permission_classes = [IsOwner]

    def get(self, request, pk):
        user = UserService.get_user_by_id(pk)
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = UserService.get_user_by_id(pk)
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        success = UserService.delete_user(pk)
        if success:
            return Response({'message': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
