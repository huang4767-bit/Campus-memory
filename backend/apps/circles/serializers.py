"""
话题圈序列化器 / Circle Serializers
"""

from rest_framework import serializers
from .models import Circle, CircleMember
from apps.schools.serializers import SchoolSerializer
from common.serializers import get_user_avatar


class CircleMemberSerializer(serializers.ModelSerializer):
    """圈子成员序列化器 / Circle Member Serializer"""
    username = serializers.CharField(source='user.username', read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = CircleMember
        fields = ['id', 'user', 'username', 'avatar', 'role', 'status', 'joined_at']
        read_only_fields = ['id', 'joined_at']

    def get_avatar(self, obj):
        return get_user_avatar(obj.user)


class CircleSerializer(serializers.ModelSerializer):
    """圈子序列化器 / Circle Serializer"""
    school = SchoolSerializer(read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    my_role = serializers.SerializerMethodField()

    class Meta:
        model = Circle
        fields = [
            'id', 'circle_type', 'school', 'grade_year', 'class_name',
            'name', 'description', 'created_by', 'owner', 'created_at',
            'member_count', 'is_member', 'is_owner', 'my_role'
        ]
        read_only_fields = ['id', 'created_at', 'created_by', 'owner']

    def get_member_count(self, obj):
        return obj.members.filter(status='approved').count()

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(
                user=request.user, status='approved'
            ).exists()
        return False

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.owner_id == request.user.id
        return False

    def get_my_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            member = obj.members.filter(
                user=request.user, status='approved'
            ).first()
            return member.role if member else None
        return None


class CircleCreateSerializer(serializers.Serializer):
    """创建班级圈序列化器 / Create Class Circle Serializer"""
    class_name = serializers.CharField(max_length=50)
    description = serializers.CharField(max_length=500, required=False, default='')

    def validate(self, attrs):
        user = self.context['request'].user
        if not hasattr(user, 'profile') or not user.profile.is_profile_complete:
            raise serializers.ValidationError('请先完善个人资料')
        return attrs
