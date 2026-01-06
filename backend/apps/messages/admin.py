"""
消息系统后台管理 / Message System Admin
"""

from django.contrib import admin
from .models import Conversation, PrivateMessage


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'user1', 'user2', 'last_message_time', 'user1_unread_count', 'user2_unread_count']
    list_filter = ['created_at']
    search_fields = ['user1__username', 'user2__username']
    readonly_fields = ['created_at']


@admin.register(PrivateMessage)
class PrivateMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'receiver', 'content_preview', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__username', 'receiver__username', 'content']
    readonly_fields = ['created_at']

    def content_preview(self, obj):
        return obj.content[:30] + '...' if len(obj.content) > 30 else obj.content
    content_preview.short_description = '消息内容'
