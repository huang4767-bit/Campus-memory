"""
学校模型 / School Models
"""

from django.db import models
from django.conf import settings


class School(models.Model):
    """
    学校模型 / School Model
    支持用户自主添加，无需审核
    """

    SCHOOL_TYPE_CHOICES = [
        ('junior', '初中'),
        ('senior', '高中'),
        ('combined', '完全中学'),  # 初高中一体 / Combined junior and senior
    ]

    # 学校名称 / School name
    name = models.CharField(
        max_length=100,
        verbose_name='学校名称'
    )

    # 省份 / Province
    province = models.CharField(
        max_length=50,
        verbose_name='省份'
    )

    # 城市 / City
    city = models.CharField(
        max_length=50,
        verbose_name='城市'
    )

    # 区县（可选）/ District (optional)
    district = models.CharField(
        max_length=50,
        blank=True,
        default='',
        verbose_name='区县'
    )

    # 学校类型 / School type
    school_type = models.CharField(
        max_length=20,
        choices=SCHOOL_TYPE_CHOICES,
        default='senior',
        verbose_name='学校类型'
    )

    # 创建者 / Created by
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_schools',
        verbose_name='创建者'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'schools'
        verbose_name = '学校'
        verbose_name_plural = '学校'
        # 联合唯一约束：名称+省+市 / Unique together: name + province + city
        unique_together = ['name', 'province', 'city']
        # 索引优化搜索 / Index for search optimization
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['province', 'city']),
        ]

    def __str__(self):
        return f"{self.province}{self.city} - {self.name}"
