from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    employee_id = serializers.CharField() # Changed from username
    password = serializers.CharField()

class ResetPasswordSerializer(serializers.Serializer):
    employee_id = serializers.CharField() # Changed from username
    new_password = serializers.CharField()