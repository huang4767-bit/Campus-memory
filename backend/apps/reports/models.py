"""
举报模型 / Report Models
"""

from django.db import models
from django.conf import settings


class Report(models.Model):
    """
    举报模型 / Report Model
    支持举报帖子、评论、用户
    """

    TARGET_TYPE_CHOICES = [
        ('post', '帖子'),
        ('comment', '评论'),
        ('user', '用户'),
    ]

    STATUS_CHOICES = [
        ('pending', '待处理'),
        ('processed', '已处理'),
        ('rejected', '已驳回'),
    ]

    # 举报人 / Reporter
    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reports_submitted',
        verbose_name='举报人'
    )

    # 举报目标类型 / Target type
    target_type = models.CharField(
        max_length=20,
        choices=TARGET_TYPE_CHOICES,
        verbose_name='目标类型'
    )

    # 举报目标ID / Target ID
    target_id = models.PositiveIntegerField(
        verbose_name='目标ID'
    )

    # 举报原因 / Reason
    reason = models.TextField(
        max_length=500,
        verbose_name='举报原因'
    )

    # 状态 / Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='状态'
    )

    # 处理人 / Handler
    handler = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reports_handled',
        verbose_name='处理人'
    )

    # 处理备注 / Handler note
    handler_note = models.TextField(
        max_length=500,
        blank=True,
        default='',
        verbose_name='处理备注'
    )

    # 处理时间 / Handled at
    handled_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='处理时间'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='举报时间'
    )

    class Meta:
        db_table = 'reports'
        verbose_name = '举报'
        verbose_name_plural = '举报'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.reporter.username} 举报 {self.target_type}:{self.target_id}"
