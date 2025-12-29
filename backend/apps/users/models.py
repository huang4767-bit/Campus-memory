"""
用户模型 / User Models
"""

from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    自定义用户模型 / Custom User Model
    继承 AbstractUser，添加手机号和登录锁定相关字段
    """

    # 手机号（可选，用于密码找回）/ Phone number (optional, for password recovery)
    phone = models.CharField(
        max_length=11,
        blank=True,
        null=True,
        unique=True,
        verbose_name='手机号'
    )

    # 登录失败次数 / Login failure count
    login_fail_count = models.IntegerField(
        default=0,
        verbose_name='登录失败次数'
    )

    # 锁定时间 / Lock time
    locked_until = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='锁定截止时间'
    )

    class Meta:
        db_table = 'users'
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    """
    用户资料模型 / User Profile Model
    存储校友信息，与 User 一对一关联
    """

    # 关联用户 / Related user
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='用户'
    )

    # 真实姓名 / Real name
    real_name = models.CharField(
        max_length=50,
        blank=True,
        default='',
        verbose_name='真实姓名'
    )

    # 头像 / Avatar
    avatar = models.ImageField(
        upload_to='avatars/%Y/%m/',
        blank=True,
        null=True,
        verbose_name='头像'
    )

    # 个人简介 / Bio
    bio = models.TextField(
        max_length=500,
        blank=True,
        default='',
        verbose_name='个人简介'
    )

    # 学校 / School
    school = models.ForeignKey(
        'schools.School',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alumni',
        verbose_name='学校'
    )

    # 入学年份 / Enrollment year
    enrollment_year = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='入学年份'
    )

    # 毕业年份 / Graduation year
    graduation_year = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='毕业年份'
    )

    # 班级名称 / Class name
    class_name = models.CharField(
        max_length=50,
        blank=True,
        default='',
        verbose_name='班级'
    )

    # 是否已完善资料 / Is profile complete
    is_profile_complete = models.BooleanField(
        default=False,
        verbose_name='是否已完善资料'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    # 更新时间 / Updated at
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='更新时间'
    )

    class Meta:
        db_table = 'user_profiles'
        verbose_name = '用户资料'
        verbose_name_plural = '用户资料'

    def __str__(self):
        return f"{self.user.username}的资料"
