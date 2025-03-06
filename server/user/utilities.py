from datetime import datetime, timezone, timedelta
from django.core.signing import Signer
from django.conf import settings 
from rest_framework.response import Response
import jwt
import os


def create_access_token(email):
     return jwt.encode({"email": email, "exp": datetime.now(timezone.utc) + timedelta(hours=1), "iat": datetime.now(timezone.utc)}, settings.ACCESS_TOKEN_SECRET, algorithm="HS256")


def create_refresh_token(email):
    return jwt.encode({"email": email, "exp": datetime.now(timezone.utc) + timedelta(days=30), "iat": datetime.now(timezone.utc)}, settings.REFRESH_TOKEN_SECRET, algorithm="HS256")



def verify_access_token(token):
    "Verify and decode access token"

    return jwt.decode(token, settings.ACCESS_TOKEN_SECRET, algorithms="HS256", options={"require": ["exp"], "verify_signature": True})


def verify_refresh_token(token):
    "Verify and decode refresh token"

    return jwt.decode(token, settings.REFRESH_TOKEN_SECRET, algorithms="HS256", options={"require": ["exp"], "verify_signature": True})


def set_access_token_cookie(response: Response, access_token: str):
    "Sign access token and set as cookie in response object"

    response.set_cookie("accessToken", access_token, 
                        # max_age=60*60,
                          samesite="None", secure=True, expires=(datetime.now(datetime.timezone.utc) + timedelta(hours=1)))



def set_refresh_token_cookie(response: Response, refresh_token: str):
    "Sign refresh token and set as cookie in response object"
    
    response.set_cookie("refreshToken", refresh_token, 
                        # max_age=30*24*60*60,
                          samesite="None", secure=True, expires=(datetime.now(datetime.timezone.utc) + timedelta(days=30)))




def delete_access_token_cookie(response: Response):
    response.set_cookie("accessToken", "", max_age=0)


def delete_refresh_token_cookie(response: Response):
    response.set_cookie("refreshToken", "", max_age=0)