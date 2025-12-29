/**
 * 省市区数据工具 / Region Data Utils
 * 使用 china-division 数据包
 */

import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';

/**
 * 获取所有省份 / Get all provinces
 * @returns {Array} 省份列表
 */
export const getProvinces = () => {
  return provinces.map(p => ({
    code: p.code,
    name: p.name,
  }));
};

/**
 * 根据省份获取城市 / Get cities by province
 * @param {string} provinceCode 省份代码
 * @returns {Array} 城市列表
 */
export const getCitiesByProvince = (provinceCode) => {
  return cities
    .filter(c => c.provinceCode === provinceCode)
    .map(c => ({
      code: c.code,
      name: c.name,
    }));
};

/**
 * 根据城市获取区县 / Get areas by city
 * @param {string} cityCode 城市代码
 * @returns {Array} 区县列表
 */
export const getAreasByCity = (cityCode) => {
  return areas
    .filter(a => a.cityCode === cityCode)
    .map(a => ({
      code: a.code,
      name: a.name,
    }));
};

/**
 * 根据省份名称获取城市 / Get cities by province name
 * @param {string} provinceName 省份名称
 * @returns {Array} 城市列表
 */
export const getCitiesByProvinceName = (provinceName) => {
  const province = provinces.find(p => p.name === provinceName);
  if (!province) return [];
  return getCitiesByProvince(province.code);
};

/**
 * 根据城市名称获取区县 / Get areas by city name
 * @param {string} provinceName 省份名称
 * @param {string} cityName 城市名称
 * @returns {Array} 区县列表
 */
export const getAreasByCityName = (provinceName, cityName) => {
  const province = provinces.find(p => p.name === provinceName);
  if (!province) return [];

  const city = cities.find(
    c => c.provinceCode === province.code && c.name === cityName
  );
  if (!city) return [];

  return getAreasByCity(city.code);
};
