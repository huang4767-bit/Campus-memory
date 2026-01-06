"""
好友系统后台管理 / Friend System Admin
"""

from django.contrib import admin
from .models import FriendRequest, Friendship, Blacklist


@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'sender', 'receiver', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['sender__username', 'receiver__username']


@admin.register(Friendship)
class FriendshipAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'friend', 'created_at']
    search_fields = ['user__username', 'friend__username']


@admin.register(Blacklist)
class BlacklistAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'blocked_user', 'created_at']
    search_fields = ['user__username', 'blocked_user__username']
