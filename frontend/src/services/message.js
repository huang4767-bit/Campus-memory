/**
 * 消息系统 API / Message System API
 */

import request from './request';

// 获取会话列表 / Get conversation list
export const getConversations = (params) => {
  return request.get('/messages/conversations/', { params });
};

// 获取聊天记录 / Get message list
export const getMessages = (conversationId, params) => {
  return request.get(`/messages/conversations/${conversationId}/messages/`, { params });
};

// 发送私信 / Send message
export const sendMessage = (data) => {
  return request.post('/messages/send/', data);
};

// 标记会话已读 / Mark conversation as read
export const markConversationRead = (conversationId) => {
  return request.post(`/messages/conversations/${conversationId}/read/`);
};

// 获取未读消息数 / Get unread count
export const getUnreadCount = () => {
  return request.get('/messages/unread-count/');
};

// 轮询获取新消息 / Poll for new messages
export const getMessageUpdates = (sinceId = 0) => {
  return request.get('/messages/updates/', { params: { since: sinceId } });
};
