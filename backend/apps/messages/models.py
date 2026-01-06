"""
消息系统模型 / Message System Models
"""

from django.db import models
from django.conf import settings


class Conversation(models.Model):
    """
    会话模型 / Conversation Model
    存储两个用户之间的会话，优化会话列表查询性能
    """

    # 用户1（ID较小的一方）/ User 1 (smaller ID)
    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_as_user1',
        verbose_name='用户1'
    )

    # 用户2（ID较大的一方）/ User 2 (larger ID)
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_as_user2',
        verbose_name='用户2'
    )

    # 最后一条消息 / Last message
    last_message = models.ForeignKey(
        'PrivateMessage',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+',
        verbose_name='最后一条消息'
    )

    # 最后消息时间（用于排序）/ Last message time (for sorting)
    last_message_time = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='最后消息时间'
    )

    # 用户1未读数 / User 1 unread count
    user1_unread_count = models.PositiveIntegerField(
        default=0,
        verbose_name='用户1未读数'
    )

    # 用户2未读数 / User 2 unread count
    user2_unread_count = models.PositiveIntegerField(
        default=0,
        verbose_name='用户2未读数'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'conversations'
        verbose_name = '会话'
        verbose_name_plural = '会话'
        unique_together = ['user1', 'user2']
        ordering = ['-last_message_time']

    def __str__(self):
        return f"Conversation: {self.user1.username} <-> {self.user2.username}"

    def get_other_user(self, user):
        """
        获取会话中的另一方 / Get the other user in conversation
        """
        return self.user2 if self.user1_id == user.id else self.user1

    def get_unread_count(self, user):
        """
        获取指定用户的未读数 / Get unread count for specified user
        """
        if self.user1_id == user.id:
            return self.user1_unread_count
        return self.user2_unread_count


class PrivateMessage(models.Model):
    """
    私信模型 / Private Message Model
    """

    # 所属会话 / Conversation
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='会话'
    )

    # 发送者 / Sender
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name='发送者'
    )

    # 接收者 / Receiver
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages',
        verbose_name='接收者'
    )

    # 消息内容 / Content
    content = models.TextField(
        max_length=1000,
        verbose_name='消息内容'
    )

    # 是否已读 / Is read
    is_read = models.BooleanField(
        default=False,
        verbose_name='是否已读'
    )

    # 已读时间 / Read at
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='已读时间'
    )

    # 创建时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='创建时间'
    )

    class Meta:
        db_table = 'private_messages'
        verbose_name = '私信'
        verbose_name_plural = '私信'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['receiver', 'is_read']),
        ]

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}: {self.content[:20]}"
