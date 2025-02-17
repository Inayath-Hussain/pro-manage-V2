from django.contrib.auth.models import AbstractBaseUser
from django.db import models

from .managers import CustomUserManager 

# Create your models here.

# create user model and override default user
class User(AbstractBaseUser):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name',]

    objects = CustomUserManager()


    def __str__(self):
        return self.email