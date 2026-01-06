# 相册与举报模块 / Album & Report Module

## 模块概述

实现班级云相册和用户举报功能，属于阶段五增值功能。

## 完成时间

2026-01-06

## 文件清单

### 后端文件

| 文件 | 用途 |
|------|------|
| `backend/apps/albums/models.py` | AlbumPhoto 模型 |
| `backend/apps/albums/serializers.py` | 相册序列化器 |
| `backend/apps/albums/views.py` | 相册视图 |
| `backend/apps/albums/urls.py` | 相册路由 |
| `backend/apps/reports/models.py` | Report 模型 |
| `backend/apps/reports/serializers.py` | 举报序列化器 |
| `backend/apps/reports/views.py` | 举报视图 |
| `backend/apps/reports/urls.py` | 举报路由 |

### 前端文件

| 文件 | 用途 |
|------|------|
| `frontend/src/services/album.js` | 相册 API |
| `frontend/src/services/report.js` | 举报 API |
| `frontend/src/pages/Album/index.jsx` | 相册页面 |
| `frontend/src/components/ReportModal/index.jsx` | 举报弹窗组件 |

## API 接口

### 相册接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/circles/{id}/album/` | 获取相册照片列表 |
| POST | `/api/v1/circles/{id}/album/` | 上传照片 |
| DELETE | `/api/v1/album/{id}/` | 删除照片 |

### 举报接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/reports/` | 提交举报 |
| GET | `/api/v1/reports/` | 举报列表（管理员） |
| POST | `/api/v1/reports/{id}/process/` | 处理举报（管理员） |

## 复用的公共代码

- `paginated_response` - 分页响应
- `StandardPagination` - 分页器
- `UserBriefSerializer` - 用户简要信息
- `is_circle_admin` - 圈子管理员权限检查
- `success_response` / `error_response` - 统一响应格式

## 功能说明

### 班级相册

- 仅班级圈支持相册功能
- 圈子成员可上传/查看照片
- 上传者或管理员可删除照片
- 支持照片备注和拍摄时间

### 举报功能

- 支持举报帖子、评论、用户
- 防止重复举报（pending 状态）
- 管理员可查看和处理举报
