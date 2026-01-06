"""
消息系统路由 / Message System URLs
"""

from django.urls import path
from . import views

urlpatterns = [
    # 会话列表 / Conversation list
    path('conversations/', views.ConversationListView.as_view(), name='conversation-list'),

    # 聊天记录 / Message list
    path('conversations/<int:conversation_id>/messages/', views.MessageListView.as_view(), name='message-list'),

    # 标记已读 / Mark read
    path('conversations/<int:conversation_id>/read/', views.MarkReadView.as_view(), name='mark-read'),

    # 发送私信 / Send message
    path('send/', views.SendMessageView.as_view(), name='send-message'),

    # 未读数 / Unread count
    path('unread-count/', views.UnreadCountView.as_view(), name='unread-count'),

    # 轮询更新 / Poll updates
    path('updates/', views.MessageUpdatesView.as_view(), name='message-updates'),
]
