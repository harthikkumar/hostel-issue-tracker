from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from .models import Hostel

User = get_user_model()

class HostelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hostel
        fields = ['id', 'name', 'description', 'address', 'total_blocks', 'total_rooms', 'contact_number']


class UserSerializer(serializers.ModelSerializer):
    hostel_details = HostelSerializer(source='hostel', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                  'phone_number', 'hostel', 'hostel_details', 'block', 'room_number']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 
                  'role', 'phone_number', 'hostel', 'block', 'room_number']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data