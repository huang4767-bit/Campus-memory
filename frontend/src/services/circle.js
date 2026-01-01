/**
 * 圈子 API 服务 / Circle API Services
 */

import request from './request';

/**
 * 获取圈子详情 / Get circle detail
 */
export const getCircleDetail = (id) => {
  return request.get(`/circles/${id}/`);
};

/**
 * 获取我的圈子列表 / Get my circles
 */
export const getMyCircles = () => {
  return request.get('/circles/my/');
};

/**
 * 加入圈子 / Join circle
 */
export const joinCircle = (id) => {
  return request.post(`/circles/${id}/join/`);
};

/**
 * 退出圈子 / Leave circle
 */
export const leaveCircle = (id) => {
  return request.post(`/circles/${id}/leave/`);
};

/**
 * 获取圈子成员列表 / Get circle members
 */
export const getCircleMembers = (id, params) => {
  return request.get(`/circles/${id}/members/`, { params });
};
