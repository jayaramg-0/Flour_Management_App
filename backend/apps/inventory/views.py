"""Inventory views — API controllers."""
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsOwner, IsOwnerOrReadOnly
from .serializers import ProductSerializer, InventorySerializer, StockUpdateSerializer
from .services import InventoryService


class ProductListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/products/ — List products or create new."""
    serializer_class = ProductSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        if self.request.user.role == 'owner':
            return InventoryService.get_all_products()
        return InventoryService.get_active_products()

    def perform_create(self, serializer):
        InventoryService.create_product(serializer.validated_data)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/products/<id>/ — Product detail."""
    serializer_class = ProductSerializer
    permission_classes = [IsOwner]

    def get_queryset(self):
        return InventoryService.get_all_products()

    def perform_destroy(self, instance):
        InventoryService.delete_product(instance.id)


class InventoryListView(generics.ListAPIView):
    """GET /api/inventory/ — View all inventory."""
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InventoryService.get_all_inventory()


class StockUpdateView(APIView):
    """PUT /api/inventory/<id>/update-stock/ — Add or remove stock."""
    permission_classes = [IsOwner]

    def put(self, request, pk):
        serializer = StockUpdateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                inventory = InventoryService.update_stock(
                    pk,
                    serializer.validated_data['quantity'],
                    serializer.validated_data['action']
                )
                return Response(InventorySerializer(inventory).data)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StockStatusView(generics.ListAPIView):
    """GET /api/inventory/status/ — Stock levels with alerts."""
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return InventoryService.get_stock_status()
