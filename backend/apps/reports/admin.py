"""
举报管理后台 / Report Admin
"""

from django.contrib import admin
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    """举报管理 / Report Admin"""
    list_display = ['id', 'reporter', 'target_type', 'target_id', 'status', 'created_at']
    list_filter = ['status', 'target_type']
    search_fields = ['reporter__username', 'reason']
    raw_id_fields = ['reporter', 'handler']
    actions = ['mark_processed', 'mark_rejected']

    @admin.action(description='标记为已处理')
    def mark_processed(self, request, queryset):
        queryset.update(status='processed', handler=request.user)

    @admin.action(description='标记为已驳回')
    def mark_rejected(self, request, queryset):
        queryset.update(status='rejected', handler=request.user)
