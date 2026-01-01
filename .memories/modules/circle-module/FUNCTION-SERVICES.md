# 公共服务函数

## 文件位置

`backend/apps/circles/services.py`

## 函数列表

### get_circle_or_none(pk)

获取圈子，不存在返回 None。

```python
circle = get_circle_or_none(pk)
if not circle:
    return error_response('圈子不存在', 404)
```

### is_circle_admin(circle, user)

检查用户是否是圈子管理员或圈主。

```python
# 同时检查 owner 和 admin 角色
if not is_circle_admin(circle, request.user):
    return error_response('无权限', 403)
```

## 使用位置

| 函数 | 使用模块 | 视图 |
|------|----------|------|
| `get_circle_or_none` | circles | 6 个视图 |
| `is_circle_admin` | circles | CircleMemberManageView, CircleAdminView |
| `is_circle_admin` | posts | PostPinView, CommentDetailView |
