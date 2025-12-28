/**
 * 用户相关 API / User API
 */

import request from './request';

// 获取当前用户信息 / Get current user info
export const getCurrentUser = () => {
  return request.get('/users/me/');
};

// 更新个人信息 / Update user info
export const updateUserInfo = (data) => {
  return request.put('/users/me/', data);
};

// 查看他人主页 / Get user profile
export const getUserProfile = (id) => {
  return request.get(`/users/${id}/`);
};

// 搜索校友 / Search alumni
export const searchUsers = (params) => {
  return request.post('/users/search/', params);
};

// 注销账号 / Delete account
export const deleteAccount = () => {
  return request.delete('/users/me/');
};
