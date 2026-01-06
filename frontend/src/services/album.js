/**
 * 相册相关 API / Album API
 */

import request from './request';

// 获取圈子相册 / Get circle album
export const getCircleAlbum = (circleId, params = {}) => {
  return request.get(`/circles/${circleId}/album/`, { params });
};

// 上传照片 / Upload photo
export const uploadPhoto = (circleId, data) => {
  return request.post(`/circles/${circleId}/album/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 删除照片 / Delete photo
export const deletePhoto = (photoId) => {
  return request.delete(`/album/${photoId}/`);
};
