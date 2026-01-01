"""
帖子序列化器 / Post Serializers
"""

from rest_framework import serializers
from .models import Post, Comment
from common.sensitive import validate_sensitive_field
from common.serializers import UserBriefSerializer


class PostSerializer(serializers.ModelSerializer):
    """帖子序列化器 / Post Serializer"""
    author = UserBriefSerializer(read_only=True)
    circle_name = serializers.CharField(source='circle.name', read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'circle', 'circle_name', 'author', 'content', 'images', 'tags',
            'status', 'is_pinned', 'is_featured', 'view_count', 'like_count',
            'comment_count', 'hot_score', 'last_reply_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'author', 'status', 'is_pinned', 'is_featured',
            'view_count', 'like_count', 'comment_count', 'hot_score',
            'last_reply_at', 'created_at', 'updated_at'
        ]


class PostCreateSerializer(serializers.Serializer):
    """创建帖子序列化器 / Create Post Serializer"""
    content = serializers.CharField(max_length=5000)
    images = serializers.ListField(
        child=serializers.URLField(),
        max_length=9,
        required=False,
        default=list
    )
    tags = serializers.ListField(
        child=serializers.CharField(max_length=20),
        max_length=5,
        required=False,
        default=list
    )

    def validate_content(self, value):
        """检查敏感词 / Check sensitive words"""
        return validate_sensitive_field(value, '内容')

    def validate_tags(self, value):
        """检查标签敏感词 / Check tags for sensitive words"""
        for tag in value:
            validate_sensitive_field(tag, '标签')
        return value


class PostUpdateSerializer(serializers.Serializer):
    """更新帖子序列化器 / Update Post Serializer"""
    content = serializers.CharField(max_length=5000, required=False)
    images = serializers.ListField(
        child=serializers.URLField(),
        max_length=9,
        required=False
    )
    tags = serializers.ListField(
        child=serializers.CharField(max_length=20),
        max_length=5,
        required=False
    )

    def validate_content(self, value):
        """检查敏感词 / Check sensitive words"""
        return validate_sensitive_field(value, '内容')

    def validate_tags(self, value):
        """检查标签敏感词 / Check tags for sensitive words"""
        for tag in value:
            validate_sensitive_field(tag, '标签')
        return value


class ReplySerializer(serializers.ModelSerializer):
    """楼中楼回复序列化器 / Reply Serializer"""
    author = UserBriefSerializer(read_only=True)
    reply_to_username = serializers.CharField(
        source='reply_to.username', read_only=True, default=None
    )

    class Meta:
        model = Comment
        fields = [
            'id', 'author', 'content', 'reply_to', 'reply_to_username',
            'like_count', 'status', 'created_at'
        ]


class CommentSerializer(serializers.ModelSerializer):
    """评论序列化器 / Comment Serializer"""
    author = UserBriefSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'author', 'content', 'parent',
            'like_count', 'status', 'created_at', 'replies', 'reply_count'
        ]

    def get_reply_count(self, obj):
        return obj.replies.filter(status='normal').count()


class CommentCreateSerializer(serializers.Serializer):
    """创建评论序列化器 / Create Comment Serializer"""
    content = serializers.CharField(max_length=500)
    parent_id = serializers.IntegerField(required=False, allow_null=True)
    reply_to_id = serializers.IntegerField(required=False, allow_null=True)

    def validate_content(self, value):
        """检查敏感词 / Check sensitive words"""
        return validate_sensitive_field(value, '评论内容')
