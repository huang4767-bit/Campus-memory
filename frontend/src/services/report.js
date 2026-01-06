/**
 * 举报相关 API / Report API
 */

import request from './request';

// 提交举报 / Submit report
export const submitReport = (data) => {
  return request.post('/reports/', data);
};

// 获取举报列表（管理员）/ Get report list (admin)
export const getReports = (params = {}) => {
  return request.get('/reports/', { params });
};

// 处理举报（管理员）/ Process report (admin)
export const processReport = (reportId, data) => {
  return request.post(`/reports/${reportId}/process/`, data);
};
