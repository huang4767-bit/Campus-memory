# 帖子模块 PRD

## 功能概述

实现圈子内的图文帖子发布、浏览、管理功能。

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/upload/image/` | POST | 图片上传 |
| `/api/v1/circles/{id}/posts/` | GET | 帖子列表 |
| `/api/v1/circles/{id}/posts/` | POST | 发布帖子 |
| `/api/v1/posts/{id}/` | GET | 帖子详情 |
| `/api/v1/posts/{id}/` | PUT | 编辑帖子 |
| `/api/v1/posts/{id}/` | DELETE | 删除帖子 |
| `/api/v1/posts/{id}/pin/` | PUT | 置顶/精华 |

## 排序规则

| 排序 | 参数 | 说明 |
|------|------|------|
| 最新发布 | ordering=created_at | 默认 |
| 热度 | ordering=hot | 浏览+点赞×2+评论×3 |
| 最新回复 | ordering=reply_at | 有新评论时更新 |

## 业务规则

- 发帖前必须加入该圈子
- 内容最多 5000 字，图片最多 9 张，标签最多 5 个
- 发布内容需通过敏感词过滤
- 删除为软删除
