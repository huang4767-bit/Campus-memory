# 互动模块 API 实现

## 文件结构

```
backend/apps/posts/
├── models.py      # Comment, Like, Favorite 模型
├── serializers.py # 评论序列化器
├── views.py       # 互动视图
└── urls.py        # 路由
```

## API 列表

| 接口 | 方法 | 路径 |
|------|------|------|
| 评论列表 | GET | /api/v1/posts/{id}/comments/ |
| 发表评论 | POST | /api/v1/posts/{id}/comments/ |
| 删除评论 | DELETE | /api/v1/comments/{id}/ |
| 帖子点赞 | POST | /api/v1/posts/{id}/like/ |
| 评论点赞 | POST | /api/v1/comments/{id}/like/ |
| 帖子收藏 | POST | /api/v1/posts/{id}/favorite/ |
| 我的收藏 | GET | /api/v1/users/me/favorites/ |

## 关键代码位置

| 功能 | 文件 | 行号 |
|------|------|------|
| Comment 模型 | models.py | 141 |
| Like 模型 | models.py | 230 |
| Favorite 模型 | models.py | 288 |
| 评论列表视图 | views.py | 268 |
| 点赞视图 | views.py | 387 |
| 收藏视图 | views.py | 441 |

## 公共模块复用

- `common/response.py`: success_response, error_response
- `common/pagination.py`: StandardPagination
- `common/sensitive.py`: validate_sensitive_field
- `common/serializers.py`: UserBriefSerializer（评论作者）
- `apps/circles/services.py`: is_circle_admin（评论删除权限）
