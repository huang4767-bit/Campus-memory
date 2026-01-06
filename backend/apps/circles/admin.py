"""
圈子管理后台 / Circle Admin
"""

from django.contrib import admin
from .models import Circle, CircleMember


@admin.register(Circle)
class CircleAdmin(admin.ModelAdmin):
    """圈子管理 / Circle Admin"""
    list_display = ['name', 'circle_type', 'school', 'grade_year', 'created_at']
    list_filter = ['circle_type', 'school']
    search_fields = ['name', 'school__name']
    raw_id_fields = ['school', 'created_by', 'owner']


@admin.register(CircleMember)
class CircleMemberAdmin(admin.ModelAdmin):
    """圈子成员管理 / Circle Member Admin"""
    list_display = ['circle', 'user', 'role', 'status', 'joined_at']
    list_filter = ['role', 'status']
    search_fields = ['circle__name', 'user__username']
    raw_id_fields = ['circle', 'user']
