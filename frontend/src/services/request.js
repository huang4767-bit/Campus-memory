/**
 * Axios 请求实例封装 / Axios Request Instance
 */

import axios from 'axios';

// 创建 axios 实例 / Create axios instance
const request = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 / Request interceptor
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 / Response interceptor
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Token 过期，尝试刷新 / Token expired, try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const res = await axios.post('/api/v1/auth/refresh/', {
            refresh: refreshToken,
          });

          // SimpleJWT 直接返回 {access: "..."} / SimpleJWT returns {access: "..."} directly
          const { access } = res.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;

          return request(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，清除 token / Refresh failed, clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default request;
