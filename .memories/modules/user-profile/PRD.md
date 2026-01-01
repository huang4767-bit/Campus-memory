# 用户信息模块 - 产品需求文档

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/users/profile/` | GET | 获取当前用户资料 |
| `/api/v1/users/profile/` | PUT | 更新当前用户资料 |
| `/api/v1/users/profile/avatar/` | POST | 上传头像 |
| `/api/v1/users/{id}/` | GET | 查看他人主页 |
| `/api/v1/users/deactivate/` | POST | 用户注销 |

## 数据模型 UserProfile

| 字段 | 类型 | 说明 |
|------|------|------|
| user | OneToOneField | 关联用户 |
| real_name | CharField(50) | 真实姓名 |
| avatar | ImageField | 头像 |
| bio | TextField(500) | 个人简介 |
| school | ForeignKey | 学校 |
| enrollment_year | IntegerField | 入学年份 |
| graduation_year | IntegerField | 毕业年份 |
| class_name | CharField(50) | 班级 |
| is_profile_complete | BooleanField | 是否已完善 |
