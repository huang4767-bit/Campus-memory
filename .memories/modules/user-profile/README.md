# 用户信息模块

## 文档导航

| 文档 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 产品需求文档 |
| [FUNCTION-API.md](./FUNCTION-API.md) | API 接口实现 |

## 模块简介

实现用户资料管理，包括完善校友信息、头像上传、查看他人主页、用户注销。

## 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 资料存储 | 独立 UserProfile 模型 | 与 User 解耦，便于扩展 |
| 注销方式 | 软删除+脱敏 | 保留记录，防止数据丢失 |

## 相关模块

- 依赖模块：backend-init、school-module
- 被依赖模块：frontend-user-pages
