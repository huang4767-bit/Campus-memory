# 管理后台与部署模块 / Admin & Deploy Module

## 模块概述

配置 Django Admin 后台管理界面，以及 Docker 容器化部署配置。

## 完成时间

2026-01-06

## 文件清单

### Django Admin 配置

| 文件 | 用途 |
|------|------|
| `backend/apps/users/admin.py` | 用户管理 |
| `backend/apps/schools/admin.py` | 学校管理 |
| `backend/apps/circles/admin.py` | 圈子管理 |
| `backend/apps/posts/admin.py` | 帖子管理 |
| `backend/apps/albums/admin.py` | 相册管理 |
| `backend/apps/reports/admin.py` | 举报管理 |

### 部署配置

| 文件 | 用途 |
|------|------|
| `backend/Dockerfile` | 后端 Docker 镜像 |
| `frontend/Dockerfile` | 前端 Docker 镜像 |
| `frontend/nginx.conf` | 前端 Nginx 配置 |
| `docker-compose.yml` | Docker 编排 |
| `deploy/nginx.conf` | 生产环境 Nginx |
| `deploy/backup.sh` | Linux 备份脚本 |
| `deploy/backup.ps1` | Windows 备份脚本 |

## Admin 功能

- 用户管理：查看/编辑用户和资料
- 帖子管理：批量标记违规删除
- 举报管理：批量处理/驳回举报

## 部署命令

```bash
# Docker 部署
docker-compose up -d

# 数据库备份
./deploy/backup.sh
```
