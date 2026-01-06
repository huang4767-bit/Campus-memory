# 消息功能实现文档 / Message Function Implementation

## 数据模型

### Conversation 会话表
| 字段 | 类型 | 说明 |
|------|------|------|
| user1 | FK | 用户1（ID较小） |
| user2 | FK | 用户2（ID较大） |
| last_message | FK | 最后一条消息 |
| last_message_time | DateTime | 最后消息时间 |
| user1_unread_count | Int | 用户1未读数 |
| user2_unread_count | Int | 用户2未读数 |

### PrivateMessage 私信表
| 字段 | 类型 | 说明 |
|------|------|------|
| conversation | FK | 所属会话 |
| sender | FK | 发送者 |
| receiver | FK | 接收者 |
| content | Text | 消息内容 |
| is_read | Bool | 是否已读 |
| read_at | DateTime | 已读时间 |

## 技术决策

| 决策 | 方案 | 原因 |
|------|------|------|
| 会话存储 | 独立 Conversation 表 | 优化会话列表查询性能 |
| 实时通信 | 短轮询 5秒 | 简单易实现，适合练手项目 |
| 前端更新 | 乐观更新 | 提升用户体验 |

## 前端轮询机制
- 使用 `useMessagePolling` Hook
- 默认间隔 5 秒
- 带 `since` 参数增量拉取
- 在 Sidebar 组件中显示未读数角标

## 公共模块复用

| 模块 | 用途 |
|------|------|
| `common/response.py` | success_response, error_response |
| `common/pagination.py` | StandardPagination |
| `common/sensitive.py` | validate_sensitive_field |
| `common/serializers.py` | UserBriefSerializer |
| `friends/services.py` | is_friend, is_blocked_by, has_blocked |

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/messages/conversations/` | GET | 会话列表 |
| `/messages/conversations/{id}/messages/` | GET | 聊天记录 |
| `/messages/send/` | POST | 发送私信 |
| `/messages/conversations/{id}/read/` | POST | 标记已读 |
| `/messages/unread-count/` | GET | 未读数 |
| `/messages/updates/` | GET | 轮询更新 |
