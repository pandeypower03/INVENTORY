from rest_framework import serializers
from .models import User
from rest_framework.serializers import ModelSerializer
from .models import Product

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'user_type')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data.get('user_type', 'user')
        )
        return user
    
    
class ProductSerializer(ModelSerializer):
    class Meta:
        model=Product
        fields='__all__'