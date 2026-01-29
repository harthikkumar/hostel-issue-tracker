from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Issue, IssueComment
from .serializers import IssueSerializer, IssueCreateSerializer, IssueCommentSerializer

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return IssueCreateSerializer
        return IssueSerializer
    
    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

class IssueCommentViewSet(viewsets.ModelViewSet):
    queryset = IssueComment.objects.all()
    serializer_class = IssueCommentSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)