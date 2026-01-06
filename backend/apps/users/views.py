"""
用户视图 / User Views
"""

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db.models import F
from django.utils import timezone
from datetime import timedelta

from common.response import success_response, error_response
from common.pagination import StandardPagination, paginated_response
from .serializers import (
    RegisterSerializer, LoginSerializer, UserInfoSerializer,
    UserProfileSerializer, UserProfileUpdateSerializer,
    UserSearchSerializer, UserSearchResultSerializer
)
from .models import UserProfile

User = get_user_model()

# 登录锁定配置 / Login lock configuration
MAX_LOGIN_ATTEMPTS = 5  # 最大失败次数 / Max failed attempts
LOCK_DURATION_MINUTES = 15  # 锁定时长（分钟）/ Lock duration (minutes)


class RegisterView(APIView):
    """
    用户注册视图 / User Registration View
    POST /api/v1/auth/register/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return success_response(UserInfoSerializer(user).data, '注册成功', 201)
        return error_response('注册失败', 400, serializer.errors)


class LoginView(APIView):
    """
    用户登录视图 / User Login View
    POST /api/v1/auth/login/
    包含登录失败锁定逻辑 / Includes login failure lock logic
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        # 查找用户 / Find user
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return error_response('用户名或密码错误', 401)

        # 检查是否被锁定 / Check if locked
        if user.locked_until and user.locked_until > timezone.now():
            remaining = (user.locked_until - timezone.now()).seconds // 60 + 1
            return error_response(f'账号已锁定，请{remaining}分钟后再试', 403)

        # 验证密码 / Verify password
        if not user.check_password(password):
            # 使用 F() 表达式原子操作，避免并发问题 / Use F() for atomic operation
            User.objects.filter(pk=user.pk).update(login_fail_count=F('login_fail_count') + 1)
            user.refresh_from_db()

            if user.login_fail_count >= MAX_LOGIN_ATTEMPTS:
                user.locked_until = timezone.now() + timedelta(minutes=LOCK_DURATION_MINUTES)
                user.save(update_fields=['locked_until'])
                return error_response(f'登录失败次数过多，账号已锁定{LOCK_DURATION_MINUTES}分钟', 403)
            remaining = MAX_LOGIN_ATTEMPTS - user.login_fail_count
            return error_response(f'用户名或密码错误，还剩{remaining}次机会', 401)

        # 登录成功，重置失败计数 / Login success, reset fail count
        user.login_fail_count = 0
        user.locked_until = None
        user.last_login = timezone.now()
        user.save()

        # 生成 JWT Token / Generate JWT Token
        refresh = RefreshToken.for_user(user)
        return success_response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserInfoSerializer(user).data
        }, '登录成功')


class UserProfileView(APIView):
    """
    当前用户资料视图 / Current User Profile View
    GET /api/v1/users/profile/ - 获取当前用户资料
    PUT /api/v1/users/profile/ - 更新当前用户资料
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """获取当前用户资料 / Get current user profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        return success_response(UserProfileSerializer(profile).data, '获取成功')

    def put(self, request):
        """更新当前用户资料 / Update current user profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileUpdateSerializer(
            profile,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return success_response(UserProfileSerializer(profile).data, '更新成功')
        return error_response('更新失败', 400, serializer.errors)


class AvatarUploadView(APIView):
    """
    头像上传视图 / Avatar Upload View
    POST /api/v1/users/profile/avatar/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """上传头像 / Upload avatar"""
        if 'avatar' not in request.FILES:
            return error_response('请选择图片', 400)

        avatar = request.FILES['avatar']

        # 验证文件大小（5MB）/ Validate file size
        if avatar.size > 5 * 1024 * 1024:
            return error_response('图片大小不能超过5MB', 400)

        # 验证文件类型 / Validate file type
        allowed_types = ['image/jpeg', 'image/png', 'image/gif']
        if avatar.content_type not in allowed_types:
            return error_response('仅支持 jpg/png/gif 格式', 400)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.avatar = avatar
        profile.save(update_fields=['avatar'])

        return success_response({'avatar': profile.avatar.url if profile.avatar else None}, '上传成功')


class UserDetailView(APIView):
    """
    他人主页视图 / Other User Profile View
    GET /api/v1/users/{id}/ - 查看他人主页（含隐私控制）
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """查看他人主页 / View other user's profile"""
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return error_response('用户不存在', 404)

        profile, _ = UserProfile.objects.get_or_create(user=user)
        data = UserProfileSerializer(profile).data

        # TODO: 4.1 阶段实现完整隐私控制（判断好友/同圈关系）
        # Privacy control will be implemented in phase 4.1 (friendship system)

        return success_response(data, '获取成功')


class UserDeactivateView(APIView):
    """
    用户注销视图 / User Deactivate View
    POST /api/v1/users/deactivate/ - 用户注销（软删除+脱敏）
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """用户注销 / Deactivate user account"""
        user = request.user

        # 软删除：禁用账号 / Soft delete: disable account
        user.is_active = False

        # 数据脱敏 / Data anonymization
        user.username = f"已注销用户_{user.id}"
        user.phone = None
        user.save()

        # 清空用户资料 / Clear profile
        try:
            profile = user.profile
            profile.real_name = ''
            profile.bio = ''
            profile.avatar = None
            profile.save()
        except UserProfile.DoesNotExist:
            pass

        return success_response(None, '账号已注销')


class UserSearchView(APIView):
    """
    校友搜索视图 / User Search View
    POST /api/v1/users/search/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """搜索校友 / Search users"""
        serializer = UserSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response('参数错误', 400, serializer.errors)

        data = serializer.validated_data
        school_id = data['school_id']

        # 构建查询 / Build query
        queryset = UserProfile.objects.filter(
            school_id=school_id,
            is_profile_complete=True
        ).select_related('user', 'school')

        # 可选条件 / Optional filters
        if data.get('graduation_year'):
            queryset = queryset.filter(graduation_year=data['graduation_year'])

        if data.get('class_name'):
            queryset = queryset.filter(class_name__icontains=data['class_name'])

        if data.get('name'):
            queryset = queryset.filter(real_name__icontains=data['name'])

        # 排除自己 / Exclude self
        queryset = queryset.exclude(user=request.user)

        # 排序 / Order by
        queryset = queryset.order_by('-graduation_year', 'real_name')

        # 分页 / Pagination
        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)
        result_serializer = UserSearchResultSerializer(page, many=True)

        return paginated_response(paginator, result_serializer.data)
