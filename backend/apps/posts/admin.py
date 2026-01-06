"""
帖子管理后台 / Post Admin
"""

from django.contrib import admin
from .models import Post, Comment, Like, Favorite


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """帖子管理 / Post Admin"""
    list_display = ['id', 'author', 'circle', 'status', 'like_count', 'created_at']
    list_filter = ['status', 'is_pinned', 'is_featured']
    search_fields = ['content', 'author__username']
    raw_id_fields = ['author', 'circle']
    actions = ['mark_violation']

    @admin.action(description='标记为违规删除')
    def mark_violation(self, request, queryset):
        queryset.update(status='violation')


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """评论管理 / Comment Admin"""
    list_display = ['id', 'author', 'post', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['content', 'author__username']
    raw_id_fields = ['author', 'post', 'parent']
