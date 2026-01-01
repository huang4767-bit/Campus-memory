# 互动模块 (Interaction Module)

## 模块概述
实现帖子的评论、点赞、收藏功能，支持楼中楼回复。

## 文档索引
- [PRD.md](./PRD.md) - 产品需求文档
- [FUNCTION-API.md](./FUNCTION-API.md) - API 实现文档

## 核心功能
1. 评论系统（支持楼中楼）
2. 点赞功能（帖子 + 评论）
3. 收藏功能

## 依赖模块
- posts: 帖子模块
- circles: 话题圈模块（权限检查）
- users: 用户模块

## 开发状态
- [x] Comment 模型
- [x] Like 模型
- [x] Favorite 模型
- [x] 评论 CRUD 接口
- [x] 点赞接口
- [x] 收藏接口
