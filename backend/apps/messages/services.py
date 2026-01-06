"""
消息系统服务层 / Message System Services
"""

from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import Conversation, PrivateMessage
from apps.friends.services import is_friend, is_blocked_by, has_blocked
from common.sensitive import validate_sensitive_field

User = get_user_model()


def get_or_create_conversation(user1_id, user2_id):
    """
    获取或创建会话 / Get or create conversation
    确保 user1_id < user2_id 以保证唯一性
    """
    if user1_id > user2_id:
        user1_id, user2_id = user2_id, user1_id

    conversation, _ = Conversation.objects.get_or_create(
        user1_id=user1_id,
        user2_id=user2_id
    )
    return conversation


def send_message(sender, receiver_id, content):
    """
    发送私信 / Send private message

    Returns:
        (success, data_or_error, code)
    """
    # 不能给自己发消息 / Cannot send message to self
    if receiver_id == sender.id:
        return False, "不能给自己发消息", 400

    # 检查接收者是否存在 / Check if receiver exists
    if not User.objects.filter(id=receiver_id).exists():
        return False, "用户不存在", 404

    # 检查是否是好友 / Check if they are friends
    if not is_friend(sender, receiver_id):
        return False, "只能给好友发送私信", 403

    # 检查黑名单 / Check blacklist
    if is_blocked_by(sender, receiver_id):
        return False, "对方已将你拉黑", 403

    if has_blocked(sender, receiver_id):
        return False, "你已将对方拉黑，请先解除", 400

    # 敏感词过滤 / Sensitive word filter
    is_valid, error_msg = validate_sensitive_field(content, "消息内容")
    if not is_valid:
        return False, error_msg, 400

    with transaction.atomic():
        # 获取或创建会话 / Get or create conversation
        conversation = get_or_create_conversation(sender.id, receiver_id)

        # 创建消息 / Create message
        message = PrivateMessage.objects.create(
            conversation=conversation,
            sender=sender,
            receiver_id=receiver_id,
            content=content
        )

        # 更新会话信息 / Update conversation info
        conversation.last_message = message
        conversation.last_message_time = message.created_at

        # 更新未读数 / Update unread count
        if conversation.user1_id == receiver_id:
            conversation.user1_unread_count += 1
        else:
            conversation.user2_unread_count += 1

        conversation.save()

    return True, message, 200


def mark_conversation_read(user, conversation_id):
    """
    标记会话已读 / Mark conversation as read

    Returns:
        (success, error_msg, code)
    """
    try:
        conversation = Conversation.objects.get(
            Q(user1=user) | Q(user2=user),
            id=conversation_id
        )
    except Conversation.DoesNotExist:
        return False, "会话不存在", 404

    with transaction.atomic():
        # 标记所有未读消息为已读 / Mark all unread messages as read
        PrivateMessage.objects.filter(
            conversation=conversation,
            receiver=user,
            is_read=False
        ).update(is_read=True, read_at=timezone.now())

        # 重置未读数 / Reset unread count
        if conversation.user1_id == user.id:
            conversation.user1_unread_count = 0
        else:
            conversation.user2_unread_count = 0
        conversation.save()

    return True, None, 200


def get_total_unread_count(user):
    """
    获取用户总未读消息数 / Get total unread message count
    """
    from django.db.models import Sum

    result = Conversation.objects.filter(
        Q(user1=user) | Q(user2=user)
    ).aggregate(
        user1_total=Sum('user1_unread_count', filter=Q(user1=user)),
        user2_total=Sum('user2_unread_count', filter=Q(user2=user))
    )

    user1_total = result['user1_total'] or 0
    user2_total = result['user2_total'] or 0
    return user1_total + user2_total


def get_new_messages(user, since_id=0):
    """
    获取新消息（用于轮询）/ Get new messages (for polling)

    Args:
        user: 当前用户
        since_id: 上次获取的最后一条消息ID

    Returns:
        新消息列表
    """
    return PrivateMessage.objects.filter(
        receiver=user,
        id__gt=since_id
    ).select_related('sender', 'conversation').order_by('id')
