from django.shortcuts import render
from django.core.signing import Signer
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
import jwt
import os



from .serializers import LoginSerializer, RegisterSerializer
from .models import User
from .utilities import set_access_token_cookie, set_refresh_token_cookie


# Create your views here.

class LoginView(APIView):
    def post(self, request: Request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')

            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                # create access and refresh tokens
                # add them as cookies in response
                access_token = jwt.encode({"email": email}, os.getenv('JWT_ACCESS_SECRET'), algorithm="HS256")
                refresh_token = jwt.encode({"email": email}, os.getenv('JWT_REFRESH_SECRET'), algorithm="HS256")

                response = Response({"message": "Success"}, status=status.HTTP_200_OK)

                set_access_token_cookie(response, access_token)
                set_refresh_token_cookie(response, refresh_token)

                return response

            else:
                return Response({"message": "Invalid email or password"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)





class RegisterView(APIView):
    def post(self, request: Request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            name = serializer.validated_data.get('name')

            # check if email exists
            try:
                user = User.objects.get(email=email)
            # if user:
                # return email already registered response
                return Response({"message": "Email already registered"}, status=status.HTTP_409_CONFLICT)
            # else:
            except ObjectDoesNotExist:
                # create new user
                User.objects.create_user(email=email, password=password, name=name)

                # create and add tokens to cookies
                access_token = jwt.encode({"email": email}, os.getenv('JWT_ACCESS_SECRET'), algorithm="HS256")
                refresh_token = jwt.encode({"email": email}, os.getenv('JWT_REFRESH_SECRET'), algorithm="HS256")

                response = Response({"message": "Success"}, status=status.HTTP_200_OK)

                set_access_token_cookie(response, access_token)
                set_refresh_token_cookie(response, refresh_token)

                return response
        
        else:
            return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


