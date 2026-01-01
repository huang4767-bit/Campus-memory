# 学校模块

## 文档导航

| 文档 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 产品需求文档 |
| [FUNCTION-API.md](./FUNCTION-API.md) | API 接口实现 |

## 模块简介

实现学校数据管理，支持用户搜索、添加学校（无需审核）。

## 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 学校去重 | name+province+city 联合唯一 | 允许不同城市同名学校 |
| 审核机制 | 无需审核 | 简化流程，练手项目 |

## 相关模块

- 依赖模块：backend-init
- 被依赖模块：user-profile、frontend-user-pages
