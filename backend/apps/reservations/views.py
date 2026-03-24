"""Reservation views."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsOwner, IsCustomer
from .serializers import ReservationSerializer, CreateReservationSerializer
from .services import ReservationService


class ReservationListCreateView(APIView):
    """GET/POST /api/reservations/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'owner':
            reservations = ReservationService.get_all_reservations()
        else:
            reservations = ReservationService.get_user_reservations(request.user)
        serializer = ReservationSerializer(reservations, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CreateReservationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                reservation = ReservationService.create_reservation(request.user, serializer.validated_data)
                return Response(ReservationSerializer(reservation).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReservationActionView(APIView):
    """PUT /api/reservations/<id>/<action>/"""
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, action):
        try:
            if action == 'cancel':
                reservation = ReservationService.cancel_reservation(pk, request.user)
            elif action == 'confirm' and request.user.role == 'owner':
                reservation = ReservationService.confirm_reservation(pk)
            elif action == 'complete' and request.user.role == 'owner':
                reservation = ReservationService.complete_reservation(pk)
            else:
                return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(ReservationSerializer(reservation).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
