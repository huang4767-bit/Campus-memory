# 登录功能实现

## 文件清单

### 后端
- `backend/apps/users/models.py` - User 模型
- `backend/apps/users/serializers.py` - 序列化器
- `backend/apps/users/views.py` - 视图
- `backend/apps/users/urls.py` - 路由

### 前端
- `frontend/src/pages/Login/index.jsx` - 登录页面
- `frontend/src/pages/Register/index.jsx` - 注册页面
- `frontend/src/services/request.js` - Token 自动刷新

## 登录失败锁定逻辑

```
密码错误 → login_fail_count + 1 → 达到5次 → 锁定15分钟
登录成功 → login_fail_count = 0
```

## 并发优化

使用 `F()` 表达式实现原子操作：

```python
User.objects.filter(pk=user.pk).update(
    login_fail_count=F('login_fail_count') + 1
)
```

## Token 自动刷新

```
401 响应 → refresh_token 换新 → 重试原请求
刷新失败 → 清除 token → 跳转登录页
```
