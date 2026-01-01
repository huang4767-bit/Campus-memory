# 认证系统模块

## 文档导航

| 文档 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 产品需求文档 |
| [FUNCTION-LOGIN.md](./FUNCTION-LOGIN.md) | 登录功能实现 |

## 模块简介

实现用户注册、登录、Token 刷新功能，包含登录失败锁定机制。

## 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 认证方式 | JWT | 无状态，适合前后端分离 |
| JWT 库 | djangorestframework-simplejwt | Django 生态首选 |
| 锁定策略 | 5次失败锁定15分钟 | 防暴力破解 |

## 相关模块

- 依赖模块：backend-init
- 被依赖模块：所有需要认证的模块
