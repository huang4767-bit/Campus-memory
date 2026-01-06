from rest_framework.pagination import PageNumberPagination

from common.response import success_response


class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


def paginated_response(paginator, data, message='获取成功'):
    """
    分页响应 / Paginated response
    """
    return success_response({
        'total': paginator.page.paginator.count,
        'page': paginator.page.number,
        'page_size': paginator.page_size,
        'results': data
    }, message)
