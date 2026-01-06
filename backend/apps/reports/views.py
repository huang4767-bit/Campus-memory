"""
举报视图 / Report Views
"""

from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from apps.posts.models import Post, Comment
from apps.users.models import UserProfile
from common.response import success_response, error_response
from common.pagination import StandardPagination, paginated_response
from .models import Report
from .serializers import (
    ReportCreateSerializer, ReportSerializer, ReportProcessSerializer
)


class ReportView(APIView):
    """
    举报视图 / Report View
    POST: 提交举报
    GET: 举报列表（管理员）
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """提交举报 / Submit report"""
        serializer = ReportCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        target_type = serializer.validated_data['target_type']
        target_id = serializer.validated_data['target_id']

        # 验证目标是否存在 / Validate target exists
        if target_type == 'post':
            if not Post.objects.filter(pk=target_id, status='normal').exists():
                return error_response('帖子不存在', 404)
        elif target_type == 'comment':
            if not Comment.objects.filter(pk=target_id, status='normal').exists():
                return error_response('评论不存在', 404)
        elif target_type == 'user':
            if not UserProfile.objects.filter(user_id=target_id).exists():
                return error_response('用户不存在', 404)

        # 检查是否重复举报 / Check duplicate report
        exists = Report.objects.filter(
            reporter=request.user,
            target_type=target_type,
            target_id=target_id,
            status='pending'
        ).exists()
        if exists:
            return error_response('您已举报过该内容，请等待处理', 409)

        # 创建举报 / Create report
        report = Report.objects.create(
            reporter=request.user,
            target_type=target_type,
            target_id=target_id,
            reason=serializer.validated_data['reason']
        )

        return success_response(
            ReportSerializer(report).data,
            '举报成功',
            201
        )

    def get(self, request):
        """获取举报列表（管理员）/ Get report list (admin only)"""
        # 检查管理员权限 / Check admin permission
        if not hasattr(request.user, 'profile') or \
           request.user.profile.role != 'platform_admin':
            return error_response('无权访问', 403)

        # 筛选条件 / Filter conditions
        status = request.query_params.get('status')
        target_type = request.query_params.get('target_type')

        reports = Report.objects.select_related(
            'reporter', 'reporter__profile',
            'handler', 'handler__profile'
        )

        if status:
            reports = reports.filter(status=status)
        if target_type:
            reports = reports.filter(target_type=target_type)

        # 分页 / Pagination
        paginator = StandardPagination()
        page = paginator.paginate_queryset(reports, request)
        serializer = ReportSerializer(page, many=True)

        return paginated_response(paginator, serializer.data)


class ReportProcessView(APIView):
    """
    举报处理视图 / Report Process View
    POST: 处理举报（管理员）
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """处理举报 / Process report"""
        # 检查管理员权限 / Check admin permission
        if not hasattr(request.user, 'profile') or \
           request.user.profile.role != 'platform_admin':
            return error_response('无权操作', 403)

        # 获取举报 / Get report
        try:
            report = Report.objects.get(pk=pk)
        except Report.DoesNotExist:
            return error_response('举报不存在', 404)

        if report.status != 'pending':
            return error_response('该举报已处理', 400)

        # 验证数据 / Validate data
        serializer = ReportProcessSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        action = serializer.validated_data['action']
        note = serializer.validated_data.get('note', '')

        # 更新举报状态 / Update report status
        report.status = 'processed' if action == 'process' else 'rejected'
        report.handler = request.user
        report.handler_note = note
        report.handled_at = timezone.now()
        report.save()

        return success_response(
            ReportSerializer(report).data,
            '处理成功'
        )
