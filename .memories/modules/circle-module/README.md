# 话题圈模块

## 文档导航

| 文档 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 产品需求文档 |
| [FUNCTION-AUTO-JOIN.md](./FUNCTION-AUTO-JOIN.md) | 自动入圈逻辑 |
| [FUNCTION-SERVICES.md](./FUNCTION-SERVICES.md) | 公共服务函数 |

## 模块简介

实现三级话题圈系统：校级圈、年级圈、班级圈。

## 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 圈子层级 | 三级（校/年级/班级） | PRD 要求 |
| 入圈方式 | 校级/年级自动，班级需申请 | 平衡开放性和私密性 |
| 自动入圈时机 | 首次完善资料时 | 确保用户有学校信息 |
| 权限设计 | owner + admin + member | 支持圈主移交 |
| 代码复用 | 抽取公共服务函数 | 减少重复代码 |

## 相关模块

- 依赖模块：school-module、user-profile
- 被依赖模块：posts-module（3.2）
