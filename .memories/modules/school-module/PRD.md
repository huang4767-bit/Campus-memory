# 学校模块 - 产品需求文档

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/schools/` | GET | 学校列表（搜索、筛选） |
| `/api/v1/schools/` | POST | 添加学校 |
| `/api/v1/schools/{id}/` | GET | 学校详情 |
| `/api/v1/schools/regions/provinces/` | GET | 省份列表 |
| `/api/v1/schools/regions/cities/` | GET | 城市列表 |

## 数据模型

| 字段 | 类型 | 说明 |
|------|------|------|
| name | CharField(100) | 学校名称 |
| province | CharField(50) | 省份 |
| city | CharField(50) | 城市 |
| district | CharField(50) | 区县（可选） |
| school_type | CharField(20) | junior/senior/combined |
