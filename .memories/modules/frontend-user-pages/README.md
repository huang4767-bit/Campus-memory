# 2.3 前端用户页面模块

## 文档导航

| 文档 | 描述 |
|------|------|
| [PRD.md](./PRD.md) | 产品需求文档 |
| [FUNCTION-SCHOOL-SELECT.md](./FUNCTION-SCHOOL-SELECT.md) | 学校选择器组件 |
| [FUNCTION-PAGES.md](./FUNCTION-PAGES.md) | 页面实现说明 |

## 模块简介

前端用户页面模块实现了用户资料相关的所有页面，包括完善信息页、个人主页、编辑资料页和他人主页。

## 关键决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 省市联动 | 后端接口方案 | 数据统一管理，便于扩展 |
| 头像裁剪 | antd-img-crop | 与 Ant Design 集成好 |
| 学校选择 | 三级联动组件 | 省→市→学校，用户体验清晰 |

## 新增文件

### 前端
- `services/school.js` - 学校相关 API
- `services/user.js` - 用户 API（更新）
- `components/SchoolSelect/index.jsx` - 学校选择器
- `pages/Profile/Complete.jsx` - 完善信息页
- `pages/Profile/index.jsx` - 个人主页
- `pages/Profile/Edit.jsx` - 编辑资料页
- `pages/User/index.jsx` - 他人主页

### 后端
- `apps/schools/regions.py` - 省市数据
- `apps/schools/views.py` - 新增省市接口

## 新增依赖

- `antd-img-crop` - 头像裁剪

## 相关模块

- 依赖模块：frontend-init、backend-init、2.1 学校模块、2.2 用户信息模块
- 被依赖模块：3.x 话题圈与帖子模块
