# 前端圈子帖子页面 (Frontend Circle & Post Pages)

## 模块概述

实现圈子详情页和帖子详情页，包括发帖、评论、点赞、收藏等功能。

## 文档索引

- [FUNCTION-API.md](./FUNCTION-API.md) - API 服务文档

## 核心功能

1. 圈子详情页（Circle）
2. 帖子详情页（Post）
3. 发帖弹窗（CreatePostModal）
4. 评论组件（楼中楼）

## 文件结构

```
frontend/src/
├── services/
│   ├── circle.js      # 圈子 API
│   ├── post.js        # 帖子 API
│   └── interaction.js # 互动 API
├── pages/
│   ├── Circle/
│   │   ├── index.jsx        # 圈子详情页
│   │   └── CreatePostModal.jsx
│   └── Post/
│       ├── index.jsx        # 帖子详情页
│       ├── PostActions.jsx  # 互动栏
│       ├── CommentSection.jsx
│       └── CommentItem.jsx  # 楼中楼评论
```

## 开发状态

- [x] API 服务（circle.js, post.js, interaction.js）
- [x] 圈子详情页
- [x] 发帖弹窗
- [x] 帖子详情页
- [x] 评论组件（楼中楼）

## 公共模块复用

| 公共模块 | 使用位置 |
|----------|----------|
| formatRelativeTime | PostCard, CommentItem |
| formatFullTime | Post/index.jsx |
| token.colorLike | PostCard, PostActions, CommentItem |
| request.js 统一错误处理 | 所有 API 调用 |
