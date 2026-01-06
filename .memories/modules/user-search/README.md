# 校友搜索模块 / User Search Module

## 模块概述

实现校友搜索功能，支持按学校、毕业年份、班级、姓名搜索校友。

## 完成时间

2026-01-06

## 文件清单

| 文件 | 用途 |
|------|------|
| `backend/apps/users/serializers.py` | 新增搜索序列化器 |
| `backend/apps/users/views.py` | 新增 UserSearchView |
| `backend/apps/users/urls.py` | 新增搜索路由 |
| `frontend/src/services/user.js` | 新增 searchUsers API |
| `frontend/src/pages/Explore/index.jsx` | 搜索页面 |
| `frontend/src/router/index.jsx` | 新增 /explore 路由 |

## API

```
POST /api/v1/users/search/
```

**参数：**
- school_id (必填)
- graduation_year (可选)
- class_name (可选，模糊搜索)
- name (可选，模糊搜索)

## 复用的公共代码

- `paginated_response` - 分页响应
- `StandardPagination` - 分页器
- `searchSchools` - 学校搜索 API
