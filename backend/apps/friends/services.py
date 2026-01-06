"""
好友系统服务层 / Friend System Services
"""

from django.db import transaction
from django.utils import timezone

from .models import FriendRequest, Friendship, Blacklist


def is_friend(user, other_user_id):
    """
    检查是否是好友 / Check if they are friends
    """
    return Friendship.objects.filter(user=user, friend_id=other_user_id).exists()


def is_blocked_by(user, other_user_id):
    """
    检查是否被对方拉黑 / Check if blocked by other user
    """
    return Blacklist.objects.filter(user_id=other_user_id, blocked_user=user).exists()


def has_blocked(user, other_user_id):
    """
    检查是否拉黑了对方 / Check if user blocked other
    """
    return Blacklist.objects.filter(user=user, blocked_user_id=other_user_id).exists()


def send_friend_request(sender, receiver_id, message=''):
    """
    发送好友请求 / Send friend request

    Returns:
        (success, data_or_error, code)
    """
    if receiver_id == sender.id:
        return False, "不能添加自己为好友", 400

    if Friendship.objects.filter(user=sender, friend_id=receiver_id).exists():
        return False, "已经是好友了", 400

    if Blacklist.objects.filter(user_id=receiver_id, blocked_user=sender).exists():
        return False, "对方已将你拉黑，无法发送请求", 403

    if Blacklist.objects.filter(user=sender, blocked_user_id=receiver_id).exists():
        return False, "你已将对方拉黑，请先解除", 400

    if FriendRequest.objects.filter(
        sender=sender, receiver_id=receiver_id, status='pending'
    ).exists():
        return False, "已有待处理的好友请求", 409

    if FriendRequest.objects.filter(
        sender_id=receiver_id, receiver=sender, status='pending'
    ).exists():
        return False, "对方已向你发送请求，请直接处理", 400

    friend_request = FriendRequest.objects.create(
        sender=sender,
        receiver_id=receiver_id,
        message=message
    )
    return True, friend_request, 200


def accept_friend_request(user, request_id):
    """
    接受好友请求 / Accept friend request

    Returns:
        (success, error_msg, code)
    """
    try:
        friend_request = FriendRequest.objects.get(
            id=request_id,
            receiver=user,
            status='pending'
        )
    except FriendRequest.DoesNotExist:
        return False, "请求不存在或已处理", 404

    with transaction.atomic():
        friend_request.status = 'accepted'
        friend_request.processed_at = timezone.now()
        friend_request.save()

        Friendship.objects.create(user=user, friend=friend_request.sender)
        Friendship.objects.create(user=friend_request.sender, friend=user)

    return True, None, 200


def reject_friend_request(user, request_id):
    """
    拒绝好友请求 / Reject friend request
    """
    try:
        friend_request = FriendRequest.objects.get(
            id=request_id,
            receiver=user,
            status='pending'
        )
    except FriendRequest.DoesNotExist:
        return False, "请求不存在或已处理", 404

    friend_request.status = 'rejected'
    friend_request.processed_at = timezone.now()
    friend_request.save()

    return True, None, 200


def delete_friend(user, friend_id):
    """
    删除好友 / Delete friend
    """
    with transaction.atomic():
        deleted, _ = Friendship.objects.filter(
            user=user, friend_id=friend_id
        ).delete()

        if deleted == 0:
            return False, "好友关系不存在", 404

        Friendship.objects.filter(user_id=friend_id, friend=user).delete()

    return True, None, 200


def add_to_blacklist(user, blocked_user_id):
    """
    添加黑名单 / Add to blacklist
    """
    if blocked_user_id == user.id:
        return False, "不能拉黑自己", 400

    if Blacklist.objects.filter(user=user, blocked_user_id=blocked_user_id).exists():
        return False, "已在黑名单中", 400

    with transaction.atomic():
        Blacklist.objects.create(user=user, blocked_user_id=blocked_user_id)

        # 解除好友关系 / Remove friendship
        Friendship.objects.filter(user=user, friend_id=blocked_user_id).delete()
        Friendship.objects.filter(user_id=blocked_user_id, friend=user).delete()

        # 取消待处理请求 / Cancel pending requests
        FriendRequest.objects.filter(
            sender=user, receiver_id=blocked_user_id, status='pending'
        ).update(status='rejected')
        FriendRequest.objects.filter(
            sender_id=blocked_user_id, receiver=user, status='pending'
        ).update(status='rejected')

    return True, None, 200


def remove_from_blacklist(user, blocked_user_id):
    """
    解除黑名单 / Remove from blacklist
    """
    deleted, _ = Blacklist.objects.filter(
        user=user, blocked_user_id=blocked_user_id
    ).delete()

    if deleted == 0:
        return False, "该用户不在黑名单中", 404

    return True, None, 200
