"""
用户路由 / User URLs
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView,
    UserProfileView, AvatarUploadView, UserDetailView, UserDeactivateView,
    UserSearchView
)

urlpatterns = [
    # 认证相关 / Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# 用户资料路由（挂载到 /api/v1/users/）/ User profile routes
profile_urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/avatar/', AvatarUploadView.as_view(), name='avatar-upload'),
    path('deactivate/', UserDeactivateView.as_view(), name='user-deactivate'),
    path('search/', UserSearchView.as_view(), name='user-search'),
    path('<int:pk>/', UserDetailView.as_view(), name='user-detail'),
]
