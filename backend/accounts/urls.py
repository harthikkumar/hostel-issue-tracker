from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, HostelViewSet, UserListView

router = DefaultRouter()
router.register(r'hostels', HostelViewSet, basename='hostel')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('', include(router.urls)),
]