from rest_framework import serializers
from .models import User

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)



class RegisterSerializer(LoginSerializer):
    name = serializers.CharField()



class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name',]



class UpdateUserInfoSerializer(serializers.Serializer):
    username = serializers.CharField(required=False)
    oldPassword = serializers.CharField(write_only=True, required=False)
    newPassword = serializers.CharField(write_only=True, required=False)

    def validate(self, data):
        username = data.get('username')
        old_password = data.get('oldPassword')
        new_password = data.get('newPassword')
        
        if not username and not (old_password and new_password):
            raise serializers.ValidationError('Atleast either username or old and new passwords should be provided')
        
        if old_password and not new_password:
            raise serializers.ValidationError("Both old and new password should be provided")
        if new_password and not old_password:
            raise serializers.ValidationError("Both old and new password should be provided")
        
        return data