"""
好友系统模型 / Friend System Models
"""

from django.db import models
from django.conf import settings


class FriendRequest(models.Model):
    """
    好友请求模型 / Friend Request Model
    存储好友申请记录，包含申请附言
    """

    STATUS_CHOICES = [
        ('pending', '待处理'),
        ('accepted', '已接受'),
        ('rejected', '已拒绝'),
    ]

    # 发起方 / Sender
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_friend_requests',
        verbose_name='发起方'
    )

    # 接收方 / Receiver
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_friend_requests',
        verbose_name='接收方'
    )

    # 申请附言 / Request message
    message = models.CharField(
        max_length=100,
        blank=True,
        default='',
        verbose_name='申请附言'
    )

    # 状态 / Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='状态'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    # 处理时间 / Processed at
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='处理时间'
    )

    class Meta:
        db_table = 'friend_requests'
        verbose_name = '好友请求'
        verbose_name_plural = '好友请求'
        # 同一对用户只能有一个待处理请求 / Only one pending request per user pair
        constraints = [
            models.UniqueConstraint(
                fields=['sender', 'receiver'],
                condition=models.Q(status='pending'),
                name='unique_pending_request'
            )
        ]

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username} ({self.status})"


class Friendship(models.Model):
    """
    好友关系模型 / Friendship Model
    双向存储，接受请求后创建两条记录
    """

    # 用户 / User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='friendships',
        verbose_name='用户'
    )

    # 好友 / Friend
    friend = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='friend_of',
        verbose_name='好友'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'friendships'
        verbose_name = '好友关系'
        verbose_name_plural = '好友关系'
        # 确保不重复 / Ensure no duplicates
        unique_together = ['user', 'friend']

    def __str__(self):
        return f"{self.user.username} <-> {self.friend.username}"


class Blacklist(models.Model):
    """
    黑名单模型 / Blacklist Model
    """

    # 拉黑者 / Blocker
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blacklist',
        verbose_name='用户'
    )

    # 被拉黑者 / Blocked user
    blocked_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blocked_by',
        verbose_name='被拉黑用户'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'blacklist'
        verbose_name = '黑名单'
        verbose_name_plural = '黑名单'
        unique_together = ['user', 'blocked_user']

    def __str__(self):
        return f"{self.user.username} blocked {self.blocked_user.username}"
