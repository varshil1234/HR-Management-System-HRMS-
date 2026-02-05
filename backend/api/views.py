from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from django.conf import settings
from .models import Employee, OTP
from .serializers import LoginSerializer, ResetPasswordSerializer
import random
import re  # <--- IMPORTED REGEX MODULE

# --- HELPER: Send Email ---
def send_email_otp(to_email, otp_code):
    subject = 'Your HRMS Verification Code'
    message = f'Hello,\n\nYour OTP is: {otp_code}\n\nIt is valid for 10 minutes.\n\nRegards,\nHR Team'
    from_email = settings.EMAIL_HOST_USER
    
    try:
        print(f"DEBUG: Attempting to send email to {to_email}...")
        send_mail(subject, message, from_email, [to_email])
        print(f"DEBUG: Email successfully sent!")
        return True
    except Exception as e:
        print(f"CRITICAL ERROR sending email: {str(e)}")
        return False

# --- 1. REGISTER ---
@api_view(['POST'])
def register_employee(request):
    data = request.data
    if Employee.objects.filter(employee_id=data.get('employee_id')).exists():
        return Response({'error': 'Employee ID already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    hashed_password = make_password(data.get('password'))
    
    Employee.objects.create(
        employee_id=data.get('employee_id'),
        password=hashed_password,
        email=data.get('email'),
        mobile=data.get('mobile'),
        is_admin=data.get('is_admin', False)
    )
    return Response({'message': 'Registered successfully'}, status=status.HTTP_201_CREATED)

# --- 2. LOGIN ---
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        emp_id = serializer.validated_data['employee_id']
        password = serializer.validated_data['password']
        
        try:
            employee = Employee.objects.get(employee_id=emp_id)
            if check_password(password, employee.password):
                return Response({
                    'message': 'Login successful', 
                    'employee_id': employee.employee_id,
                    'email': employee.email, 
                    'is_admin': employee.is_admin
                }, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            pass
            
        return Response({'error': 'Invalid ID or Password'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- 3. GENERATE OTP ---
@api_view(['POST'])
def generate_otp_view(request):
    emp_id = request.data.get('employee_id')
    
    if not emp_id:
        return Response({'error': 'Employee ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        employee = Employee.objects.get(employee_id=emp_id)
        
        # Self-Cleaning: Delete old OTPs
        OTP.objects.filter(employee_id=emp_id).delete()
        
        otp_code = str(random.randint(100000, 999999))
        OTP.objects.create(employee_id=emp_id, otp_code=otp_code)
        
        print(f"DEBUG: OTP generated for {emp_id}: {otp_code}")

        success = send_email_otp(employee.email, otp_code)
        
        if success:
            return Response({'message': f'OTP sent to {employee.email}'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Email failed to send.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Employee.DoesNotExist:
        return Response({'error': 'Employee ID not found'}, status=status.HTTP_404_NOT_FOUND)

# --- 4. VERIFY OTP ---
@api_view(['POST'])
def verify_otp_view(request):
    emp_id = request.data.get('employee_id')
    otp_input = request.data.get('otp')
    
    otp_records = OTP.objects.filter(employee_id=emp_id)

    if otp_records.exists():
        latest_otp = otp_records.last()
        if latest_otp.otp_code == otp_input:
            otp_records.delete()
            return Response({'message': 'Verified'}, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid or Expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

# --- 5. RESET PASSWORD (UPDATED: Added Validation) ---
@api_view(['POST'])
def reset_password_view(request):
    serializer = ResetPasswordSerializer(data=request.data)
    if serializer.is_valid():
        new_password = serializer.data['new_password']
        
        # --- VALIDATION LOGIC ---
        if len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)
        if not re.search(r'[A-Z]', new_password):
            return Response({'error': 'Password must contain at least one uppercase letter.'}, status=status.HTTP_400_BAD_REQUEST)
        if not re.search(r'[a-z]', new_password):
            return Response({'error': 'Password must contain at least one lowercase letter.'}, status=status.HTTP_400_BAD_REQUEST)
        if not re.search(r'[@$!%*?&]', new_password):
            return Response({'error': 'Password must contain at least one special character (@$!%*?&).'}, status=status.HTTP_400_BAD_REQUEST)
        # ------------------------

        try:
            user = Employee.objects.get(employee_id=serializer.data['employee_id'])
            user.password = make_password(new_password)
            user.save()
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)