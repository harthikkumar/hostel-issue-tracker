# from rest_framework import generics, status
# from rest_framework.response import Response
# from rest_framework.permissions import AllowAny
# from rest_framework_simplejwt.tokens import RefreshToken
# from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
# from .models import Hostel
# from django.contrib.auth import get_user_model

# User = get_user_model()

# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = RegisterSerializer
#     permission_classes = [AllowAny]
    
#     def create(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
        
#         refresh = RefreshToken.for_user(user)
        
#         return Response({
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }
#         }, status=status.HTTP_201_CREATED)

# class LoginView(generics.GenericAPIView):
#     serializer_class = LoginSerializer
#     permission_classes = [AllowAny]
    
#     def post(self, request):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
        
#         refresh = RefreshToken.for_user(user)
        
#         return Response({
#             'user': UserSerializer(user).data,
#             'tokens': {
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }
#         })





















from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Hostel
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, HostelSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })

class HostelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsAuthenticated]


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)
        return queryset