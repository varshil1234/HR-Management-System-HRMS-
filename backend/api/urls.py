from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_employee),
    path('login/', views.login_view),
    path('generate-otp/', views.generate_otp_view),
    path('verify-otp/', views.verify_otp_view),
    path('reset-password/', views.reset_password_view),
]