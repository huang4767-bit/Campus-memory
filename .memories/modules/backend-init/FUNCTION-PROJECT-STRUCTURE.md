# 项目结构说明

## 概述

Django 后端项目采用标准的 Django 项目结构，按业务模块划分 apps。

## 目录结构

```
backend/
├── config/              # 项目配置
│   ├── settings.py      # 主配置文件
│   ├── urls.py          # 根路由
│   ├── wsgi.py
│   └── asgi.py
├── apps/                # 业务模块
│   ├── users/           # 用户模块
│   ├── schools/         # 学校模块
│   ├── circles/         # 话题圈模块
│   ├── posts/           # 帖子模块
│   ├── albums/          # 相册模块
│   ├── messages/        # 消息模块
│   └── reports/         # 举报模块
├── common/              # 公共模块
│   ├── pagination.py    # 分页
│   ├── response.py      # 统一响应
│   └── exceptions.py    # 异常处理
├── manage.py
└── requirements.txt
```

## 关键配置

- 语言：`zh-hans`
- 时区：`Asia/Shanghai`
- 静态文件：`/static/`
- 媒体文件：`/media/`
