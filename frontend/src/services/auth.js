/**
 * 认证相关 API / Authentication API
 */

import request from './request';

// 用户注册 / User register
export const register = (data) => {
  return request.post('/auth/register/', data);
};

// 用户登录 / User login
export const login = (data) => {
  return request.post('/auth/login/', data);
};

// 刷新 Token / Refresh token
export const refreshToken = (refresh) => {
  return request.post('/auth/refresh/', { refresh });
};

// 退出登录 / Logout
export const logout = () => {
  return request.post('/auth/logout/');
};
