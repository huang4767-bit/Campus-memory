/**
 * 用户相关 API / User API
 */

import request from './request';

// 获取当前用户资料 / Get current user profile
export const getProfile = () => {
  return request.get('/users/profile/');
};

// 更新当前用户资料 / Update current user profile
export const updateProfile = (data) => {
  return request.put('/users/profile/', data);
};

// 上传头像 / Upload avatar
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return request.post('/users/profile/avatar/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 查看他人主页 / Get other user's profile
export const getUserById = (id) => {
  return request.get(`/users/${id}/`);
};

// 注销账号 / Deactivate account
export const deactivateAccount = () => {
  return request.post('/users/deactivate/');
};

// 搜索校友 / Search users
export const searchUsers = (data) => {
  return request.post('/users/search/', data);
};
