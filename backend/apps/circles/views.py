"""
话题圈视图 / Circle Views
"""

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from common.pagination import StandardPagination
from common.response import success_response, error_response
from .models import Circle, CircleMember
from .serializers import (
    CircleSerializer, CircleMemberSerializer, CircleCreateSerializer
)
from .services import get_circle_or_none, is_circle_admin


class MyCircleListView(APIView):
    """
    我的圈子列表 / My Circle List
    GET /api/v1/circles/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """获取我加入的圈子 / Get circles I joined"""
        memberships = CircleMember.objects.filter(
            user=request.user, status='approved'
        ).select_related('circle', 'circle__school')

        circles = [m.circle for m in memberships]
        serializer = CircleSerializer(
            circles, many=True, context={'request': request}
        )
        return success_response(serializer.data, '获取成功')


class CircleCreateView(APIView):
    """
    创建班级圈 / Create Class Circle
    POST /api/v1/circles/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """创建班级圈 / Create class circle"""
        serializer = CircleCreateSerializer(
            data=request.data, context={'request': request}
        )
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        user = request.user
        profile = user.profile

        # 检查班级圈是否已存在 / Check if class circle exists
        existing = Circle.objects.filter(
            school=profile.school,
            circle_type='class',
            grade_year=profile.enrollment_year,
            class_name=serializer.validated_data['class_name']
        ).first()

        if existing:
            return error_response('该班级圈已存在', 409)

        # 创建班级圈 / Create class circle
        circle = Circle.objects.create(
            circle_type='class',
            school=profile.school,
            grade_year=profile.enrollment_year,
            class_name=serializer.validated_data['class_name'],
            name=f"{profile.school.name} {profile.enrollment_year}级 {serializer.validated_data['class_name']}",
            description=serializer.validated_data.get('description', ''),
            created_by=user,
            owner=user
        )

        # 创建者自动成为管理员 / Creator becomes admin
        CircleMember.objects.create(
            circle=circle, user=user, role='admin', status='approved'
        )

        return success_response(
            CircleSerializer(circle, context={'request': request}).data,
            '创建成功', 201
        )


class CircleDetailView(APIView):
    """
    圈子详情 / Circle Detail
    GET /api/v1/circles/{id}/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """获取圈子详情 / Get circle detail"""
        circle = get_circle_or_none(pk)
        if not circle:
            return error_response('圈子不存在', 404)

        return success_response(
            CircleSerializer(circle, context={'request': request}).data,
            '获取成功'
        )


class CircleJoinView(APIView):
    """
    申请加入圈子 / Join Circle
    POST /api/v1/circles/{id}/join/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """申请加入圈子 / Apply to join circle"""
        circle = get_circle_or_none(pk)
        if not circle:
            return error_response('圈子不存在', 404)

        user = request.user

        # 检查是否已是成员 / Check if already member
        existing = CircleMember.objects.filter(
            circle=circle, user=user
        ).first()

        if existing:
            if existing.status == 'approved':
                return error_response('您已是该圈子成员', 409)
            elif existing.status == 'pending':
                return error_response('您的申请正在审核中', 409)

        # 校级圈和年级圈自动通过 / Auto approve for school/grade circles
        if circle.circle_type in ['school', 'grade']:
            status = 'approved'
        else:
            status = 'pending'

        CircleMember.objects.create(
            circle=circle, user=user, status=status
        )

        msg = '加入成功' if status == 'approved' else '申请已提交，等待审核'
        return success_response(None, msg, 201)


class CircleMemberListView(APIView):
    """
    圈子成员列表 / Circle Member List
    GET /api/v1/circles/{id}/members/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """获取圈子成员 / Get circle members"""
        circle = get_circle_or_none(pk)
        if not circle:
            return error_response('圈子不存在', 404)

        members = CircleMember.objects.filter(
            circle=circle, status='approved'
        ).select_related('user')

        paginator = StandardPagination()
        page = paginator.paginate_queryset(members, request)
        serializer = CircleMemberSerializer(page, many=True)

        return success_response({
            'total': paginator.page.paginator.count,
            'page': paginator.page.number,
            'page_size': paginator.page_size,
            'results': serializer.data
        }, '获取成功')


class CircleApplicationListView(APIView):
    """
    入圈申请列表（管理员）/ Circle Application List
    GET /api/v1/circles/{id}/applications/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """获取待审核申请 / Get pending applications"""
        circle = get_circle_or_none(pk)
        if not circle:
            return error_response('圈子不存在', 404)

        if not is_circle_admin(circle, request.user):
            return error_response('无权限', 403)

        applications = CircleMember.objects.filter(
            circle=circle, status='pending'
        ).select_related('user')

        serializer = CircleMemberSerializer(applications, many=True)
        return success_response(serializer.data, '获取成功')


class CircleApplicationReviewView(APIView):
    """
    审核入圈申请 / Review Application
    PUT /api/v1/circles/{id}/applications/{member_id}/
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, member_id):
        """审核申请 / Review application"""
        circle = get_circle_or_none(pk)
        if not circle:
            return error_response('圈子不存在', 404)

        if not is_circle_admin(circle, request.user):
            return error_response('无权限', 403)

        try:
            application = CircleMember.objects.get(
                pk=member_id, circle=circle, status='pending'
            )
        except CircleMember.DoesNotExist:
            return error_response('申请不存在', 404)

        action = request.data.get('action')
        if action not in ['approve', 'reject']:
            return error_response('无效操作', 400)

        application.status = 'approved' if action == 'approve' else 'rejected'
        application.save()

        msg = '已通过' if action == 'approve' else '已拒绝'
        return success_response(None, msg)


class CircleTransferView(APIView):
    """
    移交圈主 / Transfer Ownership
    PUT /api/v1/circles/{id}/transfer/
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        """移交圈主给其他成员 / Transfer ownership"""
        circle = get_circle_or_none(pk)
        if not circle:
            return error_response('圈子不存在', 404)

        # 只有圈主可以移交 / Only owner can transfer
        if circle.owner_id != request.user.id:
            return error_response('只有圈主可以移交', 403)

        new_owner_id = request.data.get('user_id')
        if not new_owner_id:
            return error_response('请指定新圈主', 400)

        # 检查新圈主是否是成员 / Check if new owner is member
        try:
            new_member = CircleMember.objects.get(
                circle=circle,
                user_id=new_owner_id,
                status='approved'
            )
        except CircleMember.DoesNotExist:
            return error_response('该用户不是圈子成员', 400)

        # 移交圈主 / Transfer ownership
        circle.owner_id = new_owner_id
        circle.save(update_fields=['owner'])

        # 新圈主设为管理员 / Set new owner as admin
        new_member.role = 'admin'
        new_member.save(update_fields=['role'])

        return success_response(None, '移交成功')
