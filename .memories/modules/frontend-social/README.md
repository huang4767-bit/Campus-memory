# 前端社交页面模块 / Frontend Social Module

## 模块概述

实现好友系统和消息系统的前端页面，包括好友列表、好友申请、用户主页交互等功能。

## 完成时间

2026-01-06

## 文件清单

| 文件 | 用途 |
|------|------|
| `services/friend.js` | 好友 API 封装（9 个接口） |
| `pages/Friend/index.jsx` | 好友页面（列表/申请/黑名单） |
| `pages/User/index.jsx` | 用户主页（增加好友/私信按钮） |
| `router/index.jsx` | 路由配置（新增 /friend） |
| `components/Layout/Sidebar.jsx` | 侧边栏（新增好友入口） |

## 复用的公共代码

- `formatRelativeTime` - 时间格式化
- `useUserStore` - 用户状态管理
- `theme.useToken()` - Ant Design 主题变量
- `List` + `Avatar` 组件模式

## 页面功能

### 好友页面 `/friend`

三个 Tab：
1. **好友列表** - 发私信、删除好友
2. **好友申请** - 接受、拒绝（带红点提示）
3. **黑名单** - 移出黑名单

### 用户主页增强

- 加好友按钮（根据状态显示：加好友/已申请/已是好友）
- 发私信按钮
- 自己的主页不显示操作按钮

## 依赖的后端 API

好友系统 9 个接口（已在 4.1 完成）：
- GET `/friends/` - 好友列表
- DELETE `/friends/{id}/` - 删除好友
- POST `/friends/request/` - 发送好友请求
- GET `/friends/requests/` - 待处理请求
- POST `/friends/accept/{id}/` - 接受请求
- POST `/friends/reject/{id}/` - 拒绝请求
- GET `/friends/blacklist/` - 黑名单列表
- POST `/friends/blacklist/add/` - 添加黑名单
- DELETE `/friends/blacklist/{id}/` - 移出黑名单
