from rest_framework import serializers
from .models import Issue, IssueComment
from accounts.serializers import UserSerializer

class IssueCommentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = IssueComment
        fields = '__all__'
        read_only_fields = ['user']

class IssueSerializer(serializers.ModelSerializer):
    reported_by_details = UserSerializer(source='reported_by', read_only=True)
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    comments = IssueCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Issue
        fields = '__all__'
        read_only_fields = ['reported_by']

class IssueCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['title', 'description', 'category', 'priority', 'is_public', 
                  'hostel', 'block', 'room_number']