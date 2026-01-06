"""
消息系统序列化器 / Message System Serializers
"""

from rest_framework import serializers
from .models import Conversation, PrivateMessage
from common.serializers import UserBriefSerializer


class MessageSerializer(serializers.ModelSerializer):
    """
    私信序列化器 / Private Message Serializer
    """
    sender = UserBriefSerializer(read_only=True)

    class Meta:
        model = PrivateMessage
        fields = ['id', 'sender', 'content', 'is_read', 'created_at']
        read_only_fields = ['id', 'sender', 'is_read', 'created_at']


class SendMessageSerializer(serializers.Serializer):
    """
    发送私信序列化器 / Send Message Serializer
    """
    receiver_id = serializers.IntegerField()
    content = serializers.CharField(max_length=1000)

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("消息内容不能为空")
        return value.strip()


class ConversationSerializer(serializers.ModelSerializer):
    """
    会话列表序列化器 / Conversation List Serializer
    """
    other_user = serializers.SerializerMethodField()
    last_message_content = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'other_user', 'last_message_content',
            'last_message_time', 'unread_count'
        ]

    def get_other_user(self, obj):
        user = self.context['request'].user
        other = obj.get_other_user(user)
        return UserBriefSerializer(other).data

    def get_last_message_content(self, obj):
        if obj.last_message:
            content = obj.last_message.content
            return content[:50] + '...' if len(content) > 50 else content
        return None

    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.get_unread_count(user)
