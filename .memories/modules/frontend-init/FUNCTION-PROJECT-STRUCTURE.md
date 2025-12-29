# 项目结构说明

## 概述

React 前端项目采用 Vite 构建，按功能模块划分目录。

## 目录结构

```
frontend/src/
├── components/      # 通用组件
│   ├── Layout/      # 布局组件
│   ├── PostCard/    # 帖子卡片
│   └── UserAvatar/  # 用户头像
├── pages/           # 页面组件
│   ├── Home/        # 首页
│   ├── Login/       # 登录
│   ├── Register/    # 注册
│   ├── Circle/      # 话题圈
│   ├── Post/        # 帖子详情
│   └── Profile/     # 个人主页
├── services/        # API 请求
│   ├── request.js   # Axios 实例
│   ├── auth.js      # 认证接口
│   └── user.js      # 用户接口
├── stores/          # 状态管理
│   └── userStore.js # 用户状态
├── router/          # 路由配置
├── styles/          # 样式配置
│   ├── theme.js     # 主题配置
│   └── global.css   # 全局样式
└── hooks/           # 自定义 Hooks
```
