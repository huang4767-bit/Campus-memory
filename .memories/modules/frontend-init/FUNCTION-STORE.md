# 状态管理

## 概述

使用 Zustand 进行状态管理，支持持久化存储。

## 文件位置

`frontend/src/stores/userStore.js`

## 用户状态

```javascript
{
  user: null,        // 用户信息
  isLoggedIn: false  // 登录状态
}
```

## 方法

- `setUser(user)` - 设置用户信息
- `clearUser()` - 清除用户信息
- `updateUser(data)` - 更新部分信息

## 持久化

使用 `zustand/middleware` 的 `persist` 中间件，数据存储在 localStorage 的 `user-storage` 键中。
