# 好友功能实现文档

## 数据模型

### FriendRequest（好友请求）
| 字段 | 类型 | 说明 |
|------|------|------|
| sender | FK(User) | 发起方 |
| receiver | FK(User) | 接收方 |
| message | CharField(100) | 申请附言 |
| status | CharField | pending/accepted/rejected |
| created_at | DateTime | 创建时间 |
| processed_at | DateTime | 处理时间 |

### Friendship（好友关系）
| 字段 | 类型 | 说明 |
|------|------|------|
| user | FK(User) | 用户 |
| friend | FK(User) | 好友 |
| created_at | DateTime | 创建时间 |

**设计说明：** 双向存储，接受请求后创建两条记录，查询简单。

### Blacklist（黑名单）
| 字段 | 类型 | 说明 |
|------|------|------|
| user | FK(User) | 拉黑者 |
| blocked_user | FK(User) | 被拉黑者 |
| created_at | DateTime | 创建时间 |

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/friends/` | 好友列表 |
| DELETE | `/api/v1/friends/<id>/` | 删除好友 |
| POST | `/api/v1/friends/request/` | 发送好友请求 |
| GET | `/api/v1/friends/requests/` | 待处理请求列表 |
| POST | `/api/v1/friends/accept/<id>/` | 接受请求 |
| POST | `/api/v1/friends/reject/<id>/` | 拒绝请求 |
| GET | `/api/v1/friends/blacklist/` | 黑名单列表 |
| POST | `/api/v1/friends/blacklist/add/` | 添加黑名单 |
| DELETE | `/api/v1/friends/blacklist/<id>/` | 解除黑名单 |

## 架构设计

采用 Service 层分离业务逻辑：

```
views.py (视图层)
    ↓ 调用
services.py (业务逻辑层)
    ↓ 操作
models.py (数据层)
```

## 复用的公共模块

| 模块 | 用途 |
|------|------|
| `common/response.py` | success_response, error_response |
| `common/serializers.py` | UserBriefSerializer, validate_user_exists |
