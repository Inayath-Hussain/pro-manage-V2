from django.utils.deprecation import MiddlewareMixin
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import AnonymousUser
from django.http import JsonResponse
from rest_framework.request import Request
from rest_framework import status
import time
import jwt


from .models import User
from .utilities import create_access_token, create_refresh_token, delete_access_token_cookie, delete_refresh_token_cookie, set_access_token_cookie, set_refresh_token_cookie, verify_access_token, verify_refresh_token



class CustomAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    
    def __call__(self, request):
              
        # code to execute before executing view
        
        # authenticate request here and renew tokens as well
        # do not send response directly from here if user is not authenticated

        refresh_cookie = request.COOKIES.get('refresh_token')

        if refresh_cookie:
            # print("refresh cookie found", refresh_cookie)
            # self._authenticate(request)
            try:
                self._authenticate(request)
            except Exception as e:
                # print("Custom caught Authentication Failed error in custom middleware", e.detail)
                return self.handle_exception(request, e)
        else:
            request.user = AnonymousUser()
        
        # print("get_response triggered in Custom Authentication middleware")
        # print(f"MIDDLEWARE: request.user = {request.user} ({type(request.user)})")
        response = self.get_response(request)

        # code to execute after view is called

        # check if new_access_token and new_refresh_token exists here and update response if it does

        new_access_token = getattr(request, "new_access_token", None)
        new_refresh_token = getattr(request, "new_refresh_token", None)

        if new_access_token:
            # print("NEW ACCESS TOKEN IN MIDDLEWARE")
            set_access_token_cookie(response, new_access_token)

        if new_refresh_token:
            # print("NEW REFRESH TOKEN IN MIDDLEWARE")
            set_refresh_token_cookie(response, new_refresh_token)

        return response


    def handle_exception(self, request: Request, exception):
        # print("clear_auth_cookies custom exception handler")
        # response = exception_handler(exc, context)

        # print("exception_handler function executed")

        if isinstance(exception, AuthenticationFailed):
            response = JsonResponse({"message": "Invalid tokens"}, status=status.HTTP_401_UNAUTHORIZED)

            delete_access_token_cookie(response)
            delete_refresh_token_cookie(response)
            # print("cookies deleted")

            return response
        
        print(exception)
        return JsonResponse({"message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    def _authenticate(self, request: Request):
        access_cookie = request.COOKIES.get('access_token')
        refresh_cookie = request.COOKIES.get('refresh_token')

        try:
            if not access_cookie:
                raise jwt.exceptions.ExpiredSignatureError()

            # print("Start access token verification")
            payload = verify_access_token(access_cookie or '')
            email = payload.get('email')
            # email = jwt.decode(access_cookie, os.getenv('JWT_ACCESS_SECRET'), algorithms="HS256", options={"require": ["exp"]}).get('email')
            # print("access token verification passed")

        except jwt.ExpiredSignatureError:
            # renew access token 
            # print("access token verification status - expired")
            # print("start refresh token verification")
            payload = verify_refresh_token(refresh_cookie)
            email = payload.get('email')
            # print("refresh token verification passed")
            # email = jwt.decode(refresh_cookie, os.getenv('JWT_REFRESH_SECRET'), algorithms="HS256", options={"require": ["exp"]}).get('email')
            
            if not email:
                raise AuthenticationFailed("Invalid token")
            
            # print("start finding user", email)
            # user = User.objects.filter(email=email).first()
            try:
                user = User.objects.get(email=email)
            except:
                # print("User not found")
                raise AuthenticationFailed("User doesn't exist")
            # if not user:
            #     print("User not found")
            #     # expire both access and refresh cookie
            #     return AuthenticationFailed("User doesn't exist")
            # print("User found")


            
            new_access_token = create_access_token(email)
            request.new_access_token = new_access_token

            # check if refresh token need to be renewed
            renewed, new_refresh_token = self.renewRefreshToken(refresh_cookie)
            if renewed:
                request.new_refresh_token = new_refresh_token

            request.user = user
            # request.user.is_authenticated = True
            # return (user, new_access_token)

        except ObjectDoesNotExist:
            # print("User not found")
            raise AuthenticationFailed("User doesn't exist")

        except:
            # expire both access and refresh cookie in custom exception handler
            # delete_access_token_cookie(res)
            raise AuthenticationFailed("Invalid tokens")
        
        else:
            # check user with email exists in db
            try:
                # print("searching for user", email)
                user = User.objects.get(email=email)
            except:
                    # print("User not found")
                    # expire both access and refresh cookie
                    raise AuthenticationFailed("User doesn't exist")
            else:
                # print("User found")
                renewed, new_refresh_token = self.renewRefreshToken(refresh_cookie)
                if renewed:
                    request.new_refresh_token = new_refresh_token

                request.user = user
                # print("request.user set", request.user)
            # request.user.is_authenticated = True
            # return (user, access_cookie)



    
    def renewRefreshToken(self, token):
            """Renew refresh token if 1 day old.
            Returns a tuple of boolean and token"""

            renewed = False
            
            try:
                payload = verify_refresh_token(token)
                email = payload.get('email')
                issued_at = payload.get('iat')

                if not issued_at or not email:
                    raise AuthenticationFailed('Invalid token')

                current_timestamp = time.time()

                seconds_difference = current_timestamp - payload.get('iat')

                if seconds_difference > 86400:
                    new_refresh_token = create_refresh_token(email)
                    # print("refresh token renewed")
                    return (True, new_refresh_token)
                else:
                    return (False, "")
            except:
                raise AuthenticationFailed('Invalid token')
            


