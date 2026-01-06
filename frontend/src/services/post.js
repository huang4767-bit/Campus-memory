/**
 * 帖子 API 服务 / Post API Services
 */

import request from './request';

/**
 * 获取圈子帖子列表 / Get circle posts
 */
export const getCirclePosts = (circleId, params) => {
  return request.get(`/circles/${circleId}/posts/`, { params });
};

/**
 * 获取帖子详情 / Get post detail
 */
export const getPostDetail = (id) => {
  return request.get(`/posts/${id}/`);
};

/**
 * 发布帖子 / Create post
 */
export const createPost = (circleId, data) => {
  return request.post(`/circles/${circleId}/posts/`, data);
};

/**
 * 编辑帖子 / Update post
 */
export const updatePost = (id, data) => {
  return request.put(`/posts/${id}/`, data);
};

/**
 * 删除帖子 / Delete post
 */
export const deletePost = (id) => {
  return request.delete(`/posts/${id}/`);
};

/**
 * 获取首页动态流 / Get home feed
 */
export const getFeed = (params) => {
  return request.get('/feed/', { params });
};
