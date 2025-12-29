# 公共模块实现

## 概述

common 模块提供统一的分页、响应格式和异常处理。

## 统一响应格式

**文件位置**：`backend/common/response.py`

```python
# 成功响应
{
    "code": 200,
    "message": "success",
    "data": {...}
}

# 错误响应
{
    "code": 400,
    "message": "error message",
    "errors": {...}  # 可选
}
```

## 分页配置

**文件位置**：`backend/common/pagination.py`

- 默认每页：20 条
- 最大每页：100 条
- 参数名：`page`, `page_size`
