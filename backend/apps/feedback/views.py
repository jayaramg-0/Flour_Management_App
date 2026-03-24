"""Feedback views."""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsOwner, IsCustomer
from .models import Feedback
from .serializers import FeedbackSerializer


class FeedbackListCreateView(APIView):
    """GET/POST /api/feedback/"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'owner':
            feedbacks = Feedback.objects.select_related('user').all()
        else:
            feedbacks = Feedback.objects.filter(user=request.user)
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
