from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        response.data = {
            "code": response.status_code,
            "message": response.data.get("detail", str(exc)),
            "errors": response.data if "detail" not in response.data else None
        }

    return response


class BusinessException(APIException):
    status_code = 422
    default_detail = "业务校验失败"
    default_code = "business_error"
