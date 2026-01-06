"""
消息系统视图 / Message System Views
"""

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Conversation, PrivateMessage
from .serializers import (
    ConversationSerializer,
    MessageSerializer,
    SendMessageSerializer
)
from . import services
from common.response import success_response, error_response
from common.pagination import StandardPagination, paginated_response


class ConversationListView(APIView):
    """
    会话列表 / Conversation List
    GET /api/v1/messages/conversations/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        conversations = Conversation.objects.filter(
            Q(user1=user) | Q(user2=user),
            last_message__isnull=False
        ).select_related('user1', 'user2', 'last_message')

        paginator = StandardPagination()
        page = paginator.paginate_queryset(conversations, request)
        serializer = ConversationSerializer(
            page, many=True, context={'request': request}
        )

        return paginated_response(paginator, serializer.data)


class MessageListView(APIView):
    """
    聊天记录 / Message List
    GET /api/v1/messages/conversations/<conversation_id>/messages/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        user = request.user

        try:
            conversation = Conversation.objects.get(
                Q(user1=user) | Q(user2=user),
                id=conversation_id
            )
        except Conversation.DoesNotExist:
            return error_response("会话不存在", 404)

        messages = PrivateMessage.objects.filter(
            conversation=conversation
        ).select_related('sender').order_by('-created_at')

        paginator = StandardPagination()
        page = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(page, many=True)

        return paginated_response(paginator, serializer.data)


class SendMessageView(APIView):
    """
    发送私信 / Send Message
    POST /api/v1/messages/send/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response("参数错误", 400, serializer.errors)

        success, result, code = services.send_message(
            sender=request.user,
            receiver_id=serializer.validated_data['receiver_id'],
            content=serializer.validated_data['content']
        )

        if not success:
            return error_response(result, code)

        return success_response(
            MessageSerializer(result).data,
            "发送成功"
        )


class MarkReadView(APIView):
    """
    标记会话已读 / Mark Conversation Read
    POST /api/v1/messages/conversations/<conversation_id>/read/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id):
        success, error, code = services.mark_conversation_read(
            request.user, conversation_id
        )

        if not success:
            return error_response(error, code)

        return success_response(message="已标记为已读")


class UnreadCountView(APIView):
    """
    获取未读消息总数 / Get Unread Count
    GET /api/v1/messages/unread-count/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = services.get_total_unread_count(request.user)
        return success_response({'unread_count': count})


class MessageUpdatesView(APIView):
    """
    轮询获取新消息 / Poll for New Messages
    GET /api/v1/messages/updates/?since=<message_id>
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        since_id = int(request.query_params.get('since', 0))

        new_messages = services.get_new_messages(request.user, since_id)
        unread_count = services.get_total_unread_count(request.user)

        return success_response({
            'unread_count': unread_count,
            'new_messages': MessageSerializer(new_messages, many=True).data
        })
