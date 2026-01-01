# 认证系统 - 产品需求文档

## 功能概述

实现用户注册、登录、Token 刷新功能。

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/auth/register/` | POST | 用户注册 |
| `/api/v1/auth/login/` | POST | 用户登录 |
| `/api/v1/auth/refresh/` | POST | Token 刷新 |

## 配置项

- Access Token 有效期：2小时
- Refresh Token 有效期：7天
- 最大登录失败次数：5次
- 锁定时长：15分钟
