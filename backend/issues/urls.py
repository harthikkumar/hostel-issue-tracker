from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet, IssueCommentViewSet

router = DefaultRouter()
router.register(r'', IssueViewSet)
router.register(r'comments', IssueCommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]