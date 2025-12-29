# Axios 请求封装

## 概述

封装 Axios 实例，提供统一的请求拦截、响应处理和 Token 自动刷新。

## 文件位置

`frontend/src/services/request.js`

## 核心功能

### 请求拦截

- 自动添加 Authorization 头
- Token 从 localStorage 读取

### 响应拦截

- 自动解包 response.data
- 401 时自动刷新 Token
- 刷新失败跳转登录页

## 使用方式

```javascript
import request from '@/services/request';

// GET 请求
const data = await request.get('/users/me/');

// POST 请求
const data = await request.post('/auth/login/', {
  username,
  password
});
```
