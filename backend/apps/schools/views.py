"""
学校视图 / School Views
"""

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from common.pagination import StandardPagination, paginated_response
from common.response import success_response, error_response
from .models import School
from .serializers import SchoolSerializer, SchoolCreateSerializer
from .regions import REGION_DATA


class SchoolListCreateView(APIView):
    """
    学校列表与创建视图 / School List and Create View
    GET /api/v1/schools/ - 获取学校列表（支持搜索）
    POST /api/v1/schools/ - 添加新学校
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """获取学校列表，支持搜索 / Get school list with search"""
        queryset = School.objects.all()

        # 搜索过滤 / Search filter
        search = request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(name__icontains=search)

        # 省市过滤 / Province and city filter
        province = request.query_params.get('province', '')
        city = request.query_params.get('city', '')
        school_type = request.query_params.get('school_type', '')

        if province:
            queryset = queryset.filter(province=province)
        if city:
            queryset = queryset.filter(city=city)
        if school_type:
            queryset = queryset.filter(school_type=school_type)

        # 排序 / Ordering
        queryset = queryset.order_by('-created_at')

        # 使用公共分页器 / Use standard pagination
        paginator = StandardPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = SchoolSerializer(page, many=True)

        return paginated_response(paginator, serializer.data)

    def post(self, request):
        """添加新学校 / Create new school"""
        serializer = SchoolCreateSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            school = serializer.save()
            return success_response(SchoolSerializer(school).data, '添加成功', 201)

        return error_response('添加失败', 400, serializer.errors)


class SchoolDetailView(APIView):
    """
    学校详情视图 / School Detail View
    GET /api/v1/schools/{id}/ - 获取学校详情
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """获取学校详情 / Get school detail"""
        try:
            school = School.objects.get(pk=pk)
        except School.DoesNotExist:
            return error_response('学校不存在', 404)

        return success_response(SchoolSerializer(school).data, '获取成功')


class ProvinceListView(APIView):
    """
    省份列表视图 / Province List View
    GET /api/v1/schools/regions/provinces/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """获取所有省份 / Get all provinces"""
        provinces = list(REGION_DATA.keys())
        return success_response(provinces, '获取成功')


class CityListView(APIView):
    """
    城市列表视图 / City List View
    GET /api/v1/schools/regions/cities/?province=xxx
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """根据省份获取城市列表 / Get cities by province"""
        province = request.query_params.get('province', '')
        if not province:
            return error_response('请选择省份', 400)

        cities = REGION_DATA.get(province, [])
        if not cities:
            return error_response('省份不存在', 404)

        return success_response(cities, '获取成功')
