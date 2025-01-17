# users/urls.py
from django.urls import path
from .views import LoginView, RegisterView
from .views import ProductDetailView, ProductListCreateView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('product/',ProductListCreateView.as_view(), name="student-list-create"),
    path('product/<int:pk>/',ProductDetailView.as_view(), name="student-detail"),
]