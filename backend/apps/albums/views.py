"""
相册视图 / Album Views
"""

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from apps.circles.models import Circle, CircleMember
from apps.circles.services import is_circle_admin
from common.response import success_response, error_response
from common.pagination import StandardPagination, paginated_response
from .models import AlbumPhoto
from .serializers import AlbumPhotoSerializer, AlbumPhotoUploadSerializer


class CircleAlbumView(APIView):
    """
    圈子相册视图 / Circle Album View
    GET: 获取相册照片列表
    POST: 上传照片
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, circle_id):
        """获取相册照片列表 / Get album photos"""
        # 检查圈子是否存在 / Check circle exists
        try:
            circle = Circle.objects.get(pk=circle_id)
        except Circle.DoesNotExist:
            return error_response('圈子不存在', 404)

        # 检查是否是班级圈 / Check if class circle
        if circle.circle_type != 'class':
            return error_response('仅班级圈支持相册功能', 400)

        # 检查是否是圈子成员 / Check membership
        is_member = CircleMember.objects.filter(
            circle=circle,
            user=request.user,
            status='approved'
        ).exists()

        if not is_member and circle.owner_id != request.user.id:
            return error_response('您不是该圈子成员', 403)

        # 获取照片列表 / Get photos
        photos = AlbumPhoto.objects.filter(circle=circle).select_related(
            'uploader', 'uploader__profile'
        )

        # 分页 / Pagination
        paginator = StandardPagination()
        page = paginator.paginate_queryset(photos, request)
        serializer = AlbumPhotoSerializer(page, many=True)

        return paginated_response(paginator, serializer.data)

    def post(self, request, circle_id):
        """上传照片 / Upload photo"""
        # 检查圈子是否存在 / Check circle exists
        try:
            circle = Circle.objects.get(pk=circle_id)
        except Circle.DoesNotExist:
            return error_response('圈子不存在', 404)

        # 检查是否是班级圈 / Check if class circle
        if circle.circle_type != 'class':
            return error_response('仅班级圈支持相册功能', 400)

        # 检查是否是圈子成员 / Check membership
        is_member = CircleMember.objects.filter(
            circle=circle,
            user=request.user,
            status='approved'
        ).exists()

        if not is_member and circle.owner_id != request.user.id:
            return error_response('您不是该圈子成员', 403)

        # 验证数据 / Validate data
        serializer = AlbumPhotoUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        # 创建照片 / Create photo
        photo = AlbumPhoto.objects.create(
            circle=circle,
            uploader=request.user,
            image=serializer.validated_data['image'],
            description=serializer.validated_data.get('description', ''),
            taken_at=serializer.validated_data.get('taken_at')
        )

        return success_response(
            AlbumPhotoSerializer(photo).data,
            '上传成功',
            201
        )


class AlbumPhotoDetailView(APIView):
    """
    相册照片详情视图 / Album Photo Detail View
    DELETE: 删除照片（上传者或管理员）
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        """删除照片 / Delete photo"""
        try:
            photo = AlbumPhoto.objects.select_related('circle').get(pk=pk)
        except AlbumPhoto.DoesNotExist:
            return error_response('照片不存在', 404)

        # 检查权限：上传者或圈子管理员 / Check permission
        is_uploader = photo.uploader_id == request.user.id
        is_admin = is_circle_admin(photo.circle, request.user)

        if not is_uploader and not is_admin:
            return error_response('无权删除此照片', 403)

        # 删除照片文件和记录 / Delete photo file and record
        photo.image.delete(save=False)
        photo.delete()

        return success_response(message='删除成功')
