from rest_framework import serializers
from .models import Customer, Loan, Repayment
from decimal import Decimal
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import PermissionDenied
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class LoanSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True
    )

    monthly_payment = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = '__all__'

    def get_monthly_payment(self, obj):
        # simple interest calculation
        principal = obj.amount
        rate = Decimal(obj.interest_rate) / 100
        time = Decimal(obj.tenor)

        total_interest = principal * rate * (time / Decimal(12))
        total_amount = principal + total_interest #total repayment

        return round(total_amount / time, 2) #monthly payment


class RepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]

    # Ensure username is unique
    def validate_username(self, value):
        value = value.strip()

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")

        return value

    # Normalize and validate email
    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")

        return value

    # Validate matching passwords
    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        return attrs

    # Create new user
    def create(self, validated_data):
        validated_data.pop("confirm_password")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # lets jwt check username and password
        data = super().validate(attrs) 

    #    gets the authenticated user
        user = self.user

        # Check if user belongs to a group
        groups = user.groups.all()

        if not groups.exists():
            # stops the login
            raise PermissionDenied(
                "Your account has not been assigned a role yet. "
                "Kindly contact the administrator."
            )

        # Get user's first group as role
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": groups.first().name,
        }

        return data