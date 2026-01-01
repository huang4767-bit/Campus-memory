# 页面实现说明

## 页面路由配置

文件：`frontend/src/router/index.jsx`

```javascript
{ path: '/profile/complete', element: <ProfileComplete /> }
{ path: 'profile', element: <Profile /> }
{ path: 'profile/edit', element: <ProfileEdit /> }
{ path: 'user/:id', element: <UserProfile /> }
```

## 完善信息页

文件：`frontend/src/pages/Profile/Complete.jsx`

### 表单字段
- real_name - 真实姓名
- school - 学校（SchoolSelect 组件）
- enrollment_year - 入学年份
- graduation_year - 毕业年份
- class_name - 班级

### 提交逻辑
提交时设置 `is_profile_complete: true`，成功后跳转首页。
