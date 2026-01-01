# 用户信息 API 实现

## 文件清单

- `backend/apps/users/models.py` - UserProfile 模型
- `backend/apps/users/serializers.py` - 资料序列化器
- `backend/apps/users/views.py` - 资料视图
- `backend/apps/users/urls.py` - 资料路由

## 头像上传验证

- 文件大小：≤ 5MB
- 文件类型：jpg/png/gif
- 存储路径：`media/avatars/年/月/`

## 用户注销逻辑

```python
user.is_active = False
user.username = f"已注销用户_{user.id}"
user.phone = None
```

## 注意事项

1. UserProfile 使用 `get_or_create` 自动创建
2. 隐私控制待 4.1 阶段实现
