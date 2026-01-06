# 消息系统模块 / Message Module

## 模块概述
消息系统实现用户之间的私信功能，包含会话管理、消息发送、已读状态和实时轮询。

## 文档导航
- [PRD.md](./PRD.md) - 产品需求文档
- [FUNCTION-MESSAGE.md](./FUNCTION-MESSAGE.md) - 消息功能实现文档

## 技术栈
- 后端：Django REST Framework
- 前端：React + Ant Design
- 实时通信：短轮询（5秒间隔）

## 相关文件

### 后端
```
backend/apps/messages/
├── models.py       # 数据模型（Conversation, PrivateMessage）
├── serializers.py  # 序列化器
├── services.py     # 业务逻辑层
├── views.py        # API 视图
├── urls.py         # 路由配置
└── admin.py        # 后台管理
```

### 前端
```
frontend/src/
├── services/message.js           # API 服务
├── pages/Message/index.jsx       # 消息中心页面
├── pages/Message/Chat.jsx        # 聊天页面
└── hooks/useMessagePolling.js    # 轮询 Hook
```

## 依赖模块
- `apps.friends` - 好友关系检查
- `common/response.py` - 统一响应格式
- `common/sensitive.py` - 敏感词过滤
