/**
 * 学校相关 API / School API
 */

import request from './request';

// 获取省份列表 / Get province list
export const getProvinces = () => {
  return request.get('/schools/regions/provinces/');
};

// 获取城市列表 / Get city list by province
export const getCities = (province) => {
  return request.get('/schools/regions/cities/', { params: { province } });
};

// 搜索学校 / Search schools
export const searchSchools = (params) => {
  return request.get('/schools/', { params });
};

// 获取学校详情 / Get school detail
export const getSchoolById = (id) => {
  return request.get(`/schools/${id}/`);
};

// 添加学校 / Create school
export const createSchool = (data) => {
  return request.post('/schools/', data);
};
