"""
公共序列化器 / Common Serializers
"""

from rest_framework import serializers


def get_user_avatar(user):
    """
    获取用户头像URL / Get user avatar URL

    Args:
        user: User 对象
    Returns:
        头像URL或None
    """
    if hasattr(user, 'profile') and user.profile and user.profile.avatar:
        return user.profile.avatar.url
    return None


class UserBriefSerializer(serializers.Serializer):
    """
    用户简要信息序列化器 / User Brief Serializer
    用于帖子作者、评论作者等场景
    """
    id = serializers.IntegerField()
    username = serializers.CharField()
    avatar = serializers.SerializerMethodField()

    def get_avatar(self, obj):
        return get_user_avatar(obj)
