"""
学校管理后台 / School Admin
"""

from django.contrib import admin
from .models import School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    """学校管理 / School Admin"""
    list_display = ['name', 'province', 'city', 'school_type', 'created_at']
    list_filter = ['school_type', 'province']
    search_fields = ['name', 'province', 'city']
    raw_id_fields = ['created_by']
