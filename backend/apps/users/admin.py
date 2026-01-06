"""
用户管理后台 / User Admin
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    """用户资料内联 / User Profile Inline"""
    model = UserProfile
    can_delete = False
    verbose_name = '用户资料'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """用户管理 / User Admin"""
    list_display = ['username', 'phone', 'is_active', 'date_joined']
    list_filter = ['is_active', 'is_staff', 'date_joined']
    search_fields = ['username', 'phone']
    inlines = [UserProfileInline]

    fieldsets = BaseUserAdmin.fieldsets + (
        ('扩展信息', {'fields': ('phone', 'login_fail_count', 'locked_until')}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """用户资料管理 / User Profile Admin"""
    list_display = ['user', 'real_name', 'school', 'graduation_year', 'class_name']
    list_filter = ['is_profile_complete', 'graduation_year']
    search_fields = ['user__username', 'real_name', 'class_name']
    raw_id_fields = ['user', 'school']
