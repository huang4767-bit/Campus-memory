# 公共模块实现

## 概述

common 模块提供统一的分页、响应格式、异常处理、敏感词校验和序列化器。

## 文件清单

| 文件 | 说明 |
|------|------|
| response.py | 统一响应格式 |
| pagination.py | 分页配置 |
| sensitive.py | 敏感词校验 |
| serializers.py | 公共序列化器 |

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

## 敏感词校验

**文件位置**：`backend/common/sensitive.py`

```python
# 检查敏感词
check_sensitive(text) -> (bool, list)

# 序列化器校验（抛出 ValidationError）
validate_sensitive_field(value, field_name='内容')
```

## 公共序列化器

**文件位置**：`backend/common/serializers.py`

```python
# 获取用户头像
get_user_avatar(user) -> str | None

# 用户简要信息序列化器
class UserBriefSerializer:
    fields: id, username, avatar
```

**使用位置**：

| 模块 | 序列化器 | 使用方式 |
|------|----------|----------|
| posts | PostSerializer | `author = UserBriefSerializer()` |
| posts | ReplySerializer | `author = UserBriefSerializer()` |
| posts | CommentSerializer | `author = UserBriefSerializer()` |
| circles | CircleMemberSerializer | `get_user_avatar(obj.user)` |
