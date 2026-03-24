"""Payment and Debt views."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsOwner
from .serializers import PaymentSerializer, DebtSerializer, RecordPaymentSerializer
from .services import DebtService
from .models import Payment


class PaymentListView(APIView):
    """GET/POST /api/payments/"""
    permission_classes = [IsOwner]

    def get(self, request):
        payments = Payment.objects.select_related('customer', 'sale').all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RecordPaymentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                debt = DebtService.record_payment(serializer.validated_data)
                return Response(DebtSerializer(debt).data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DebtListView(APIView):
    """GET /api/debts/"""
    permission_classes = [IsOwner]

    def get(self, request):
        show_all = request.query_params.get('all', 'false') == 'true'
        if show_all:
            debts = DebtService.get_all_debts_including_paid()
        else:
            debts = DebtService.get_all_debts()
        serializer = DebtSerializer(debts, many=True)
        return Response(serializer.data)


class DebtDetailView(APIView):
    """GET /api/debts/<id>/"""
    permission_classes = [IsOwner]

    def get(self, request, pk):
        debt = DebtService.get_debt(pk)
        if not debt:
            return Response({'error': 'Debt not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = DebtSerializer(debt)
        return Response(serializer.data)
