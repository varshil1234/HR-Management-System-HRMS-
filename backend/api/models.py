from django.db import models

class Employee(models.Model):
    # Changed 'username' to 'employee_id' to match frontend
    employee_id = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15)
    
    # Simple boolean to mark if this user is a "Super Admin" for the app
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.employee_id

class OTP(models.Model):
    # This also uses employee_id now
    employee_id = models.CharField(max_length=50)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee_id} - {self.otp_code}"