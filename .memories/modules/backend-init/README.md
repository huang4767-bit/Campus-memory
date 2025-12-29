# 后端初始化模块

## 文档导航

| 文档 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 产品需求文档 |
| [FUNCTION-PROJECT-STRUCTURE.md](./FUNCTION-PROJECT-STRUCTURE.md) | 项目结构说明 |
| [FUNCTION-COMMON-MODULE.md](./FUNCTION-COMMON-MODULE.md) | 公共模块实现 |

## 模块简介

后端初始化模块负责搭建 Django 项目基础框架，包括项目结构、数据库配置、DRF 集成、CORS 配置和公共模块。

## 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| Web 框架 | Django 4.2 | 成熟稳定，ORM 强大 |
| API 框架 | Django REST Framework | Django 生态首选 |
| 数据库 | PostgreSQL 15+ | 支持 JSON 字段，性能好 |
| 认证方式 | JWT | 无状态，适合前后端分离 |

## 相关模块

- 依赖模块：无（基础模块）
- 被依赖模块：所有后续模块
