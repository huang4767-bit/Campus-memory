/**
 * 好友系统 API / Friend System API
 */

import request from './request';

// 获取好友列表 / Get friend list
export const getFriends = (params) => {
  return request.get('/friends/', { params });
};

// 删除好友 / Delete friend
export const deleteFriend = (friendId) => {
  return request.delete(`/friends/${friendId}/`);
};

// 发送好友请求 / Send friend request
export const sendFriendRequest = (data) => {
  return request.post('/friends/request/', data);
};

// 获取待处理请求列表 / Get pending requests
export const getPendingRequests = () => {
  return request.get('/friends/requests/');
};

// 接受好友请求 / Accept friend request
export const acceptFriendRequest = (requestId) => {
  return request.post(`/friends/accept/${requestId}/`);
};

// 拒绝好友请求 / Reject friend request
export const rejectFriendRequest = (requestId) => {
  return request.post(`/friends/reject/${requestId}/`);
};

// 获取黑名单列表 / Get blacklist
export const getBlacklist = () => {
  return request.get('/friends/blacklist/');
};

// 添加到黑名单 / Add to blacklist
export const addToBlacklist = (data) => {
  return request.post('/friends/blacklist/add/', data);
};

// 移出黑名单 / Remove from blacklist
export const removeFromBlacklist = (userId) => {
  return request.delete(`/friends/blacklist/${userId}/`);
};
