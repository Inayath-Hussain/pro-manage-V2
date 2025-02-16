from django.urls import path

from .views import Dummy, LoginView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('register/', RegisterView.as_view(), name="register"),
    path('dummy/', Dummy.as_view(), name='dummy')
]