from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status




from .serializers import LoginSerializer, RegisterSerializer, UserInfoSerializer, UpdateUserInfoSerializer
from .models import User
from .utilities import create_access_token, create_refresh_token, set_access_token_cookie, set_refresh_token_cookie, verify_access_token


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
                access_token = create_access_token(email)
                refresh_token = create_refresh_token(email)

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
                access_token = create_access_token(email)
                refresh_token = create_refresh_token(email)

                response = Response({"message": "Success"}, status=status.HTTP_201_CREATED)

                set_access_token_cookie(response, access_token)
                set_refresh_token_cookie(response, refresh_token)

                return response
        
        else:
            return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)




class GetUserInfo(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request: Request):
        try:
            serializer = UserInfoSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UpdateUserInfo(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request: Request):
        serializer = UpdateUserInfoSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        username = serializer.validated_data.get('username')
        old_password = serializer.validated_data.get('old_password')
        new_password = serializer.validated_data.get('new_password')

        if username:
            request.user.name = username

        if old_password:
            if not request.user.check_password(old_password):
                return Response({"error": "old password does not match"}, status=status.HTTP_400_BAD_REQUEST)

            if request.user.check_password(new_password):
                return Response({"error": "new password cannot be same as old"}, status=status.HTTP_400_BAD_REQUEST)
            
            request.user.set_password(new_password)
        
        request.user.save()

        return Response({"message": "success"}, status=status.HTTP_200_OK)

        # request.user.check_password(serializer.validated_data['old_password'])




class Dummy(APIView):
    permission_classes=[IsAuthenticated]

    def get(self, request: Request):
        print("is_authenticated in view", request.user.is_authenticated, request.user)
        return Response({"message": "success"}, status=status.HTTP_200_OK)