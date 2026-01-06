# 好友系统模块 / Friends Module

## 模块概述
好友系统实现用户之间的社交连接，包含好友请求、好友管理和黑名单功能。

## 文档导航
- [PRD.md](./PRD.md) - 产品需求文档
- [FUNCTION-FRIEND.md](./FUNCTION-FRIEND.md) - 好友功能实现文档

## 技术栈
- Django REST Framework
- PostgreSQL

## 相关文件
```
backend/apps/friends/
├── models.py       # 数据模型
├── serializers.py  # 序列化器
├── services.py     # 业务逻辑层
├── views.py        # 视图层
├── urls.py         # 路由配置
├── admin.py        # 后台管理
└── apps.py         # 应用配置
```

## 依赖模块
- `common/response.py` - 统一响应格式
- `common/serializers.py` - 公共序列化器
