# 前端初始化模块

## 文档导航

| 文档 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 产品需求文档 |
| [FUNCTION-PROJECT-STRUCTURE.md](./FUNCTION-PROJECT-STRUCTURE.md) | 项目结构说明 |
| [FUNCTION-REQUEST.md](./FUNCTION-REQUEST.md) | Axios 请求封装 |
| [FUNCTION-STORE.md](./FUNCTION-STORE.md) | 状态管理 |

## 模块简介

前端初始化模块负责搭建 React 项目基础框架，包括 Vite 构建、Ant Design UI、路由、请求封装和状态管理。

## 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 构建工具 | Vite 7.x | 开发体验好，HMR 快 |
| UI 框架 | Ant Design 6.x | 组件丰富，中文友好 |
| 路由 | React Router 7.x | React 生态标准 |
| 状态管理 | Zustand | 轻量简洁 |
| HTTP 客户端 | Axios | 功能完善 |

## 相关模块

- 依赖模块：无（基础模块）
- 被依赖模块：所有前端页面模块

## 公共工具函数

**文件位置**：`frontend/src/utils/format.js`

| 函数 | 用途 |
|------|------|
| formatRelativeTime | 相对时间（刚刚、3小时前） |
| formatFullTime | 完整时间（2026年1月1日 12:00） |

**使用位置**：PostCard、Post/index.jsx、CommentItem
