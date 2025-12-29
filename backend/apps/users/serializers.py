"""
用户序列化器 / User Serializers
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile
from apps.schools.serializers import SchoolSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    用户注册序列化器 / User Registration Serializer
    """
    password = serializers.CharField(
        write_only=True,
        min_length=6,
        max_length=20,
        error_messages={
            'min_length': '密码至少6位',
            'max_length': '密码最多20位',
        }
    )
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password', 'phone']
        extra_kwargs = {
            'username': {
                'min_length': 4,
                'max_length': 20,
                'error_messages': {
                    'min_length': '用户名至少4位',
                    'max_length': '用户名最多20位',
                }
            },
            'phone': {'required': False},
        }

    def validate(self, attrs):
        """验证两次密码是否一致 / Validate password confirmation"""
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': '两次密码不一致'})
        return attrs

    def create(self, validated_data):
        """创建用户 / Create user"""
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            phone=validated_data.get('phone'),
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    用户登录序列化器 / User Login Serializer
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class UserInfoSerializer(serializers.ModelSerializer):
    """
    用户信息序列化器 / User Info Serializer
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'phone', 'date_joined', 'last_login']
        read_only_fields = ['id', 'date_joined', 'last_login']


class UserProfileSerializer(serializers.ModelSerializer):
    """
    用户资料序列化器 / User Profile Serializer
    用于获取和展示用户资料
    """
    username = serializers.CharField(source='user.username', read_only=True)
    school_info = SchoolSerializer(source='school', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'real_name', 'avatar', 'bio',
            'school', 'school_info', 'enrollment_year', 'graduation_year',
            'class_name', 'is_profile_complete', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_profile_complete', 'created_at', 'updated_at']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    用户资料更新序列化器 / User Profile Update Serializer
    用于完善和更新用户资料
    """

    class Meta:
        model = UserProfile
        fields = [
            'real_name', 'bio', 'school',
            'enrollment_year', 'graduation_year', 'class_name'
        ]

    def validate(self, attrs):
        """验证必填字段，判断是否完善资料 / Validate required fields"""
        return attrs

    def update(self, instance, validated_data):
        """更新资料，检查是否完善 / Update profile and check completion"""
        instance = super().update(instance, validated_data)

        # 检查是否完善资料 / Check if profile is complete
        if all([
            instance.real_name,
            instance.school,
            instance.enrollment_year,
            instance.graduation_year,
            instance.class_name
        ]):
            instance.is_profile_complete = True
            instance.save(update_fields=['is_profile_complete'])

        return instance
