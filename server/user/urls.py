from django.urls import path

from .views import Dummy, LoginView, RegisterView, GetUserInfo, UpdateUserInfo

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('register/', RegisterView.as_view(), name="register"),
    path('info/', GetUserInfo.as_view(), name='get-user-info'),
    path('update/', UpdateUserInfo.as_view(), name='update-user-info'),
    path('dummy/', Dummy.as_view(), name='dummy'),
]