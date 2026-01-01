"""
帖子视图 / Post Views
"""

import os
import uuid
from datetime import datetime

from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser

from common.pagination import StandardPagination
from common.response import success_response, error_response
from apps.circles.models import Circle, CircleMember
from apps.circles.services import is_circle_admin
from .models import Post, Comment, Like, Favorite
from .serializers import (
    PostSerializer, PostCreateSerializer, PostUpdateSerializer,
    CommentSerializer, CommentCreateSerializer
)


class ImageUploadView(APIView):
    """
    图片上传 / Image Upload
    POST /api/v1/upload/image/
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    # 允许的图片类型 / Allowed image types
    ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
    MAX_SIZE = 5 * 1024 * 1024  # 5MB

    def post(self, request):
        """上传图片 / Upload image"""
        file = request.FILES.get('file')
        if not file:
            return error_response('请选择图片', 400)

        # 检查文件类型 / Check file type
        if file.content_type not in self.ALLOWED_TYPES:
            return error_response('仅支持 jpg/png/gif 格式', 400)

        # 检查文件大小 / Check file size
        if file.size > self.MAX_SIZE:
            return error_response('图片大小不能超过 5MB', 400)

        # 生成文件路径 / Generate file path
        now = datetime.now()
        ext = os.path.splitext(file.name)[1].lower()
        filename = f"{uuid.uuid4().hex}{ext}"
        relative_path = f"posts/{now.year}/{now.month:02d}/{filename}"
        full_path = os.path.join(settings.MEDIA_ROOT, relative_path)

        # 确保目录存在 / Ensure directory exists
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # 保存文件 / Save file
        with open(full_path, 'wb+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)

        # 返回URL / Return URL
        url = f"{settings.MEDIA_URL}{relative_path}"
        return success_response({'url': url}, '上传成功')


class CirclePostListView(APIView):
    """
    圈子帖子列表 / Circle Post List
    GET /api/v1/circles/{id}/posts/
    POST /api/v1/circles/{id}/posts/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, circle_id):
        """获取圈子帖子列表 / Get circle posts"""
        try:
            circle = Circle.objects.get(pk=circle_id)
        except Circle.DoesNotExist:
            return error_response('圈子不存在', 404)

        # 获取排序方式 / Get ordering
        ordering = request.query_params.get('ordering', 'created_at')

        # 构建查询 / Build query
        posts = Post.objects.filter(
            circle=circle, status='normal'
        ).select_related('author', 'author__profile', 'circle')

        # 排序 / Ordering
        if ordering == 'hot':
            posts = posts.order_by('-is_pinned', '-hot_score', '-created_at')
        elif ordering == 'reply_at':
            posts = posts.order_by('-is_pinned', '-last_reply_at', '-created_at')
        else:
            posts = posts.order_by('-is_pinned', '-created_at')

        # 分页 / Pagination
        paginator = StandardPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(page, many=True, context={'request': request})

        return success_response({
            'total': paginator.page.paginator.count,
            'page': paginator.page.number,
            'page_size': paginator.page_size,
            'results': serializer.data
        }, '获取成功')

    def post(self, request, circle_id):
        """发布帖子 / Create post"""
        try:
            circle = Circle.objects.get(pk=circle_id)
        except Circle.DoesNotExist:
            return error_response('圈子不存在', 404)

        # 检查是否是圈子成员 / Check membership
        is_member = CircleMember.objects.filter(
            circle=circle, user=request.user, status='approved'
        ).exists()
        if not is_member:
            return error_response('您不是该圈子成员', 403)

        # 验证数据 / Validate data
        serializer = PostCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        # 创建帖子 / Create post
        post = Post.objects.create(
            circle=circle,
            author=request.user,
            content=serializer.validated_data['content'],
            images=serializer.validated_data.get('images', []),
            tags=serializer.validated_data.get('tags', [])
        )

        return success_response(
            PostSerializer(post, context={'request': request}).data,
            '发布成功', 201
        )


class PostDetailView(APIView):
    """
    帖子详情 / Post Detail
    GET /api/v1/posts/{id}/
    PUT /api/v1/posts/{id}/
    DELETE /api/v1/posts/{id}/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """获取帖子详情 / Get post detail"""
        try:
            post = Post.objects.select_related(
                'author', 'author__profile', 'circle'
            ).get(pk=pk)
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        # 已删除的帖子返回特殊提示 / Deleted post returns special message
        if post.status == 'deleted':
            return error_response('该帖子已删除', 404)
        if post.status == 'violation':
            return error_response('该帖子因违规已被删除', 404)

        # 增加浏览量 / Increment view count
        post.view_count += 1
        post.save(update_fields=['view_count'])
        post.update_hot_score()

        return success_response(
            PostSerializer(post, context={'request': request}).data,
            '获取成功'
        )

    def put(self, request, pk):
        """编辑帖子 / Update post"""
        try:
            post = Post.objects.get(pk=pk, status='normal')
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        # 只有作者可以编辑 / Only author can edit
        if post.author_id != request.user.id:
            return error_response('无权限编辑', 403)

        serializer = PostUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        # 更新字段 / Update fields
        if 'content' in serializer.validated_data:
            post.content = serializer.validated_data['content']
        if 'images' in serializer.validated_data:
            post.images = serializer.validated_data['images']
        if 'tags' in serializer.validated_data:
            post.tags = serializer.validated_data['tags']
        post.save()

        return success_response(
            PostSerializer(post, context={'request': request}).data,
            '更新成功'
        )

    def delete(self, request, pk):
        """删除帖子 / Delete post (soft delete)"""
        try:
            post = Post.objects.get(pk=pk, status='normal')
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        # 只有作者可以删除 / Only author can delete
        if post.author_id != request.user.id:
            return error_response('无权限删除', 403)

        post.status = 'deleted'
        post.save(update_fields=['status'])

        return success_response(None, '删除成功')


class PostPinView(APIView):
    """
    置顶/精华设置 / Pin/Feature Post
    PUT /api/v1/posts/{id}/pin/
    """
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        """设置置顶/精华 / Set pin/feature"""
        try:
            post = Post.objects.select_related('circle').get(pk=pk, status='normal')
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        # 检查是否是圈子管理员 / Check if circle admin
        if not is_circle_admin(post.circle, request.user):
            return error_response('无权限操作', 403)

        # 更新状态 / Update status
        if 'is_pinned' in request.data:
            post.is_pinned = request.data['is_pinned']
        if 'is_featured' in request.data:
            post.is_featured = request.data['is_featured']
        post.save(update_fields=['is_pinned', 'is_featured'])

        return success_response(
            PostSerializer(post, context={'request': request}).data,
            '设置成功'
        )


class PostCommentListView(APIView):
    """
    帖子评论列表 / Post Comment List
    GET /api/v1/posts/{id}/comments/
    POST /api/v1/posts/{id}/comments/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        """获取帖子评论列表 / Get post comments"""
        try:
            post = Post.objects.get(pk=post_id, status='normal')
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        # 只获取一级评论 / Only get top-level comments
        comments = Comment.objects.filter(
            post=post, parent__isnull=True, status='normal'
        ).select_related('author', 'author__profile').prefetch_related(
            'replies', 'replies__author', 'replies__author__profile', 'replies__reply_to'
        )

        paginator = StandardPagination()
        page = paginator.paginate_queryset(comments, request)
        serializer = CommentSerializer(page, many=True)

        return success_response({
            'total': paginator.page.paginator.count,
            'page': paginator.page.number,
            'page_size': paginator.page_size,
            'results': serializer.data
        }, '获取成功')

    def post(self, request, post_id):
        """发表评论 / Create comment"""
        try:
            post = Post.objects.get(pk=post_id, status='normal')
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        serializer = CommentCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        data = serializer.validated_data
        parent = None
        reply_to = None

        # 处理楼中楼回复 / Handle nested reply
        if data.get('parent_id'):
            try:
                parent = Comment.objects.get(
                    pk=data['parent_id'], post=post, status='normal'
                )
            except Comment.DoesNotExist:
                return error_response('父评论不存在', 404)

        if data.get('reply_to_id'):
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                reply_to = User.objects.get(pk=data['reply_to_id'])
            except User.DoesNotExist:
                return error_response('回复用户不存在', 404)

        comment = Comment.objects.create(
            post=post,
            author=request.user,
            content=data['content'],
            parent=parent,
            reply_to=reply_to
        )

        # 更新帖子计数和最后回复时间 / Update post counts
        post.last_reply_at = timezone.now()
        post.save(update_fields=['last_reply_at'])
        post.update_counts()

        return success_response(
            CommentSerializer(comment).data,
            '评论成功', 201
        )


class CommentDetailView(APIView):
    """
    评论详情 / Comment Detail
    DELETE /api/v1/comments/{id}/
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        """删除评论 / Delete comment (soft delete)"""
        try:
            comment = Comment.objects.select_related('post', 'post__circle').get(pk=pk, status='normal')
        except Comment.DoesNotExist:
            return error_response('评论不存在', 404)

        # 作者、圈子管理员、圈主可以删除 / Author, circle admin, circle owner can delete
        is_author = comment.author_id == request.user.id

        if not is_author and not is_circle_admin(comment.post.circle, request.user):
            return error_response('无权限删除', 403)

        comment.status = 'deleted'
        comment.save(update_fields=['status'])

        # 更新帖子评论数 / Update post comment count
        comment.post.update_counts()

        return success_response(None, '删除成功')


class PostLikeView(APIView):
    """
    帖子点赞 / Post Like
    POST /api/v1/posts/{id}/like/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """点赞/取消点赞 / Toggle like"""
        try:
            post = Post.objects.get(pk=pk, status='normal')
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        like, created = Like.objects.get_or_create(
            user=request.user, post=post, comment=None
        )

        if not created:
            like.delete()
            post.update_counts()
            return success_response({'liked': False}, '取消点赞')

        post.update_counts()
        return success_response({'liked': True}, '点赞成功')


class CommentLikeView(APIView):
    """
    评论点赞 / Comment Like
    POST /api/v1/comments/{id}/like/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """点赞/取消点赞 / Toggle like"""
        try:
            comment = Comment.objects.get(pk=pk, status='normal')
        except Comment.DoesNotExist:
            return error_response('评论不存在', 404)

        like, created = Like.objects.get_or_create(
            user=request.user, post=None, comment=comment
        )

        if not created:
            like.delete()
            comment.update_like_count()
            return success_response({'liked': False}, '取消点赞')

        comment.update_like_count()
        return success_response({'liked': True}, '点赞成功')


class PostFavoriteView(APIView):
    """
    帖子收藏 / Post Favorite
    POST /api/v1/posts/{id}/favorite/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        """收藏/取消收藏 / Toggle favorite"""
        try:
            post = Post.objects.get(pk=pk, status='normal')
        except Post.DoesNotExist:
            return error_response('帖子不存在', 404)

        favorite, created = Favorite.objects.get_or_create(
            user=request.user, post=post
        )

        if not created:
            favorite.delete()
            return success_response({'favorited': False}, '取消收藏')

        return success_response({'favorited': True}, '收藏成功')


class MyFavoriteListView(APIView):
    """
    我的收藏列表 / My Favorite List
    GET /api/v1/users/me/favorites/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """获取我的收藏列表 / Get my favorites"""
        favorites = Favorite.objects.filter(
            user=request.user, post__status='normal'
        ).select_related(
            'post', 'post__author', 'post__author__profile', 'post__circle'
        ).order_by('-created_at')

        paginator = StandardPagination()
        page = paginator.paginate_queryset(favorites, request)

        # 返回帖子列表 / Return post list
        posts = [f.post for f in page]
        serializer = PostSerializer(posts, many=True, context={'request': request})

        return success_response({
            'total': paginator.page.paginator.count,
            'page': paginator.page.number,
            'page_size': paginator.page_size,
            'results': serializer.data
        }, '获取成功')
