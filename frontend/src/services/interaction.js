/**
 * 互动 API 服务 / Interaction API Services
 */

import request from './request';

/**
 * 帖子点赞/取消 / Toggle post like
 */
export const togglePostLike = (postId) => {
  return request.post(`/posts/${postId}/like/`);
};

/**
 * 帖子收藏/取消 / Toggle post favorite
 */
export const togglePostFavorite = (postId) => {
  return request.post(`/posts/${postId}/favorite/`);
};

/**
 * 获取我的收藏列表 / Get my favorites
 */
export const getMyFavorites = (params) => {
  return request.get('/users/me/favorites/', { params });
};

/**
 * 获取帖子评论列表 / Get post comments
 */
export const getPostComments = (postId, params) => {
  return request.get(`/posts/${postId}/comments/`, { params });
};

/**
 * 发表评论 / Create comment
 */
export const createComment = (postId, data) => {
  return request.post(`/posts/${postId}/comments/`, data);
};

/**
 * 删除评论 / Delete comment
 */
export const deleteComment = (commentId) => {
  return request.delete(`/comments/${commentId}/`);
};

/**
 * 评论点赞/取消 / Toggle comment like
 */
export const toggleCommentLike = (commentId) => {
  return request.post(`/comments/${commentId}/like/`);
};
