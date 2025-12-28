from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """仅允许对象所有者访问"""
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsClassAdmin(BasePermission):
    """班级管理员权限"""
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and \
               request.user.profile.role in ['class_admin', 'platform_admin']


class IsPlatformAdmin(BasePermission):
    """平台管理员权限"""
    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and \
               request.user.profile.role == 'platform_admin'
