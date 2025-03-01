from rest_framework.views import exception_handler
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .utilities import delete_access_token_cookie, delete_refresh_token_cookie


def clear_auth_cookies(exc, context):
    "Custom exception handler to clear auth cookies when Authentication fails"

    # call exception_handler to let django handle known exceptions properly.
    # After calling that a response returned or None
    # print("clear_auth_cookies custom exception handler")

    print("printed from clear_auth_cookies", exc)

    response = exception_handler(exc, context)

    # print("exception_handler function executed")

    if isinstance(exc, AuthenticationFailed):
        # print("Authentication Failed exception triggered")
        response = Response({"message": "Invalid tokens"}, status=status.HTTP_401_UNAUTHORIZED)
        delete_access_token_cookie(response)
        delete_refresh_token_cookie(response)
        return response
    
    if isinstance(exc, NotAuthenticated):
        # print("Permission Denied exception triggered")
        response = Response({"message": "Authentication token is missing"}, status=status.HTTP_401_UNAUTHORIZED)
        return response


    if response is None:
        return Response(
            {"error": str(exc)},  # Convert error message to JSON
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Ensure all DRF-generated errors return JSON
    response.data = {"error": response.data}
    
    return response