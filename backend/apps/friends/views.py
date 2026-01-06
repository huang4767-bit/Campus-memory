"""
好友系统视图 / Friend System Views
"""

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from .models import FriendRequest, Friendship, Blacklist
from .serializers import (
    FriendRequestCreateSerializer,
    FriendRequestSerializer,
    FriendSerializer,
    BlacklistSerializer,
    BlacklistCreateSerializer,
)
from .services import (
    send_friend_request,
    accept_friend_request,
    reject_friend_request,
    delete_friend,
    add_to_blacklist,
    remove_from_blacklist,
)
from common.response import success_response, error_response


class SendFriendRequestView(APIView):
    """
    发送好友请求 / Send Friend Request
    POST /api/v1/friends/request/
    """

    def post(self, request):
        serializer = FriendRequestCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("参数错误", 400, serializer.errors)

        success, result, code = send_friend_request(
            request.user,
            serializer.validated_data['receiver_id'],
            serializer.validated_data.get('message', '')
        )

        if not success:
            return error_response(result, code)

        return success_response(
            FriendRequestSerializer(result).data,
            "好友请求已发送"
        )


class PendingRequestListView(ListAPIView):
    """
    收到的待处理好友请求列表 / Pending Friend Requests List
    GET /api/v1/friends/requests/
    """
    serializer_class = FriendRequestSerializer

    def get_queryset(self):
        return FriendRequest.objects.filter(
            receiver=self.request.user,
            status='pending'
        ).select_related('sender', 'receiver').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(serializer.data)


class AcceptFriendRequestView(APIView):
    """
    接受好友请求 / Accept Friend Request
    POST /api/v1/friends/accept/<id>/
    """

    def post(self, request, request_id):
        success, error_msg, code = accept_friend_request(request.user, request_id)
        if not success:
            return error_response(error_msg, code)
        return success_response(message="已添加好友")


class RejectFriendRequestView(APIView):
    """
    拒绝好友请求 / Reject Friend Request
    POST /api/v1/friends/reject/<id>/
    """

    def post(self, request, request_id):
        success, error_msg, code = reject_friend_request(request.user, request_id)
        if not success:
            return error_response(error_msg, code)
        return success_response(message="已拒绝请求")


class FriendListView(ListAPIView):
    """
    好友列表 / Friend List
    GET /api/v1/friends/
    """
    serializer_class = FriendSerializer

    def get_queryset(self):
        return Friendship.objects.filter(
            user=self.request.user
        ).select_related('friend').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(serializer.data)


class DeleteFriendView(APIView):
    """
    删除好友 / Delete Friend
    DELETE /api/v1/friends/<id>/
    """

    def delete(self, request, friend_id):
        success, error_msg, code = delete_friend(request.user, friend_id)
        if not success:
            return error_response(error_msg, code)
        return success_response(message="已删除好友")


class BlacklistListView(ListAPIView):
    """
    黑名单列表 / Blacklist List
    GET /api/v1/friends/blacklist/
    """
    serializer_class = BlacklistSerializer

    def get_queryset(self):
        return Blacklist.objects.filter(
            user=self.request.user
        ).select_related('blocked_user').order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(serializer.data)


class AddToBlacklistView(APIView):
    """
    添加黑名单 / Add to Blacklist
    POST /api/v1/friends/blacklist/add/
    """

    def post(self, request):
        serializer = BlacklistCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("参数错误", 400, serializer.errors)

        success, error_msg, code = add_to_blacklist(
            request.user,
            serializer.validated_data['user_id']
        )
        if not success:
            return error_response(error_msg, code)
        return success_response(message="已拉黑")


class RemoveFromBlacklistView(APIView):
    """
    解除黑名单 / Remove from Blacklist
    DELETE /api/v1/friends/blacklist/<id>/
    """

    def delete(self, request, user_id):
        success, error_msg, code = remove_from_blacklist(request.user, user_id)
        if not success:
            return error_response(error_msg, code)
        return success_response(message="已解除拉黑")
