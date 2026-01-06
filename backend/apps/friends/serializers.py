"""
好友系统序列化器 / Friend System Serializers
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import FriendRequest, Friendship, Blacklist
from common.serializers import UserBriefSerializer, validate_user_exists

User = get_user_model()


class FriendRequestCreateSerializer(serializers.Serializer):
    """
    发送好友请求序列化器 / Send Friend Request Serializer
    """
    receiver_id = serializers.IntegerField()
    message = serializers.CharField(max_length=100, required=False, default='')

    def validate_receiver_id(self, value):
        return validate_user_exists(value)


class FriendRequestSerializer(serializers.ModelSerializer):
    """
    好友请求详情序列化器 / Friend Request Detail Serializer
    """
    sender = UserBriefSerializer(read_only=True)
    receiver = UserBriefSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'message', 'status', 'created_at']


class FriendSerializer(serializers.ModelSerializer):
    """
    好友列表序列化器 / Friend List Serializer
    """
    friend = UserBriefSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = ['id', 'friend', 'created_at']


class BlacklistSerializer(serializers.ModelSerializer):
    """
    黑名单序列化器 / Blacklist Serializer
    """
    blocked_user = UserBriefSerializer(read_only=True)

    class Meta:
        model = Blacklist
        fields = ['id', 'blocked_user', 'created_at']


class BlacklistCreateSerializer(serializers.Serializer):
    """
    添加黑名单序列化器 / Add to Blacklist Serializer
    """
    user_id = serializers.IntegerField()

    def validate_user_id(self, value):
        return validate_user_exists(value)
