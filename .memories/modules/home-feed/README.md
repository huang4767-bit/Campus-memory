# 首页动态流模块 / Home Feed Module

## 模块概述

实现首页动态流功能，展示用户已加入圈子的最新帖子。

## 完成时间

2026-01-06

## 文件清单

| 文件 | 用途 |
|------|------|
| `backend/apps/posts/views.py` | 新增 FeedView |
| `backend/config/urls.py` | 新增 /feed/ 路由 |
| `frontend/src/services/post.js` | 新增 getFeed API |
| `frontend/src/pages/Home/index.jsx` | 修改首页展示动态流 |

## API

```
GET /api/v1/feed/
```

返回用户已加入圈子的最新帖子，支持分页。

## 复用的公共代码

- `paginated_response` - 分页响应
- `PostSerializer` - 帖子序列化
- `PostCard` 组件 - 帖子卡片
- `formatRelativeTime` - 时间格式化
