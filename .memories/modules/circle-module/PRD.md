# 话题圈模块 - 产品需求文档

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/v1/circles/` | GET | 我的圈子列表 |
| `/api/v1/circles/create/` | POST | 创建班级圈 |
| `/api/v1/circles/{id}/` | GET | 圈子详情 |
| `/api/v1/circles/{id}/join/` | POST | 申请加入 |
| `/api/v1/circles/{id}/members/` | GET | 成员列表 |
| `/api/v1/circles/{id}/applications/` | GET | 申请列表 |
| `/api/v1/circles/{id}/applications/{id}/` | PUT | 审核申请 |
| `/api/v1/circles/{id}/transfer/` | PUT | 移交圈主 |

## 数据模型

### Circle
| 字段 | 类型 | 说明 |
|------|------|------|
| circle_type | CharField | school/grade/class |
| school | ForeignKey | 关联学校 |
| grade_year | IntegerField | 入学年份 |
| class_name | CharField | 班级名称 |
| name | CharField | 圈子名称 |
| created_by | ForeignKey | 创建者（不可变） |
| owner | ForeignKey | 圈主（可移交） |

### CircleMember
| 字段 | 类型 | 说明 |
|------|------|------|
| circle | ForeignKey | 关联圈子 |
| user | ForeignKey | 关联用户 |
| role | CharField | member/admin |
| status | CharField | pending/approved/rejected |
