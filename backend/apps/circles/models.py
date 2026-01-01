"""
话题圈模型 / Circle Models
"""

from django.db import models
from django.conf import settings


class Circle(models.Model):
    """
    话题圈模型 / Circle Model
    支持三级圈子：校级圈、年级圈、班级圈
    """

    CIRCLE_TYPE_CHOICES = [
        ('school', '校级圈'),
        ('grade', '年级圈'),
        ('class', '班级圈'),
    ]

    # 圈子类型 / Circle type
    circle_type = models.CharField(
        max_length=20,
        choices=CIRCLE_TYPE_CHOICES,
        verbose_name='圈子类型'
    )

    # 关联学校 / Related school
    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='circles',
        verbose_name='学校'
    )

    # 入学年份（年级圈、班级圈用）/ Enrollment year
    grade_year = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='入学年份'
    )

    # 班级名称（班级圈用）/ Class name
    class_name = models.CharField(
        max_length=50,
        blank=True,
        default='',
        verbose_name='班级名称'
    )

    # 圈子名称 / Circle name
    name = models.CharField(
        max_length=100,
        verbose_name='圈子名称'
    )

    # 圈子简介 / Circle description
    description = models.TextField(
        max_length=500,
        blank=True,
        default='',
        verbose_name='圈子简介'
    )

    # 创建者 / Created by
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_circles',
        verbose_name='创建者'
    )

    # 圈主（可移交）/ Owner (transferable)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='owned_circles',
        verbose_name='圈主'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'circles'
        verbose_name = '话题圈'
        verbose_name_plural = '话题圈'
        # 联合唯一约束 / Unique together
        unique_together = ['school', 'circle_type', 'grade_year', 'class_name']

    def __str__(self):
        return self.name


class CircleMember(models.Model):
    """
    圈子成员模型 / Circle Member Model
    """

    ROLE_CHOICES = [
        ('member', '普通成员'),
        ('admin', '管理员'),
    ]

    STATUS_CHOICES = [
        ('pending', '待审核'),
        ('approved', '已通过'),
        ('rejected', '已拒绝'),
    ]

    # 关联圈子 / Related circle
    circle = models.ForeignKey(
        Circle,
        on_delete=models.CASCADE,
        related_name='members',
        verbose_name='圈子'
    )

    # 关联用户 / Related user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='circle_memberships',
        verbose_name='用户'
    )

    # 角色 / Role
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='member',
        verbose_name='角色'
    )

    # 状态 / Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='状态'
    )

    # 加入时间 / Joined at
    joined_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='加入时间'
    )

    class Meta:
        db_table = 'circle_members'
        verbose_name = '圈子成员'
        verbose_name_plural = '圈子成员'
        unique_together = ['circle', 'user']

    def __str__(self):
        return f"{self.user.username} - {self.circle.name}"
