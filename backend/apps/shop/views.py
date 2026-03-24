"""Shop status views."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.users.permissions import IsOwner
from .models import ShopStatus
from .serializers import ShopStatusSerializer


class ShopStatusView(APIView):
    """GET/PUT /api/shop/status/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        shop = ShopStatus.get_status()
        serializer = ShopStatusSerializer(shop)
        return Response(serializer.data)

    def put(self, request):
        if request.user.role != 'owner':
            return Response({'error': 'Only owner can toggle shop status'}, status=status.HTTP_403_FORBIDDEN)
        shop = ShopStatus.get_status()
        is_open = request.data.get('is_open')
        if is_open is not None:
            shop.is_open = is_open
            shop.updated_by = request.user
            shop.save()
        serializer = ShopStatusSerializer(shop)
        return Response(serializer.data)
