"""Reservation URLs — /api/reservations/"""
from django.urls import path
from .views import ReservationListCreateView, ReservationActionView

urlpatterns = [
    path('', ReservationListCreateView.as_view(), name='reservation-list'),
    path('<int:pk>/<str:action>/', ReservationActionView.as_view(), name='reservation-action'),
]
