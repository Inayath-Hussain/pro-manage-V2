from django.core.signing import Signer
from rest_framework.response import Response


def set_access_token_cookie(response: Response, access_token: str):
    "Sign access token and set as cookie in response object"
    response.set_cookie("access_token", access_token, max_age=60*60)



def set_refresh_token_cookie(response: Response, refresh_token: str):
    "Sign refresh token and set as cookie in response object"
    response.set_cookie("refresh_token", refresh_token, max_age=30*24*60*60)

