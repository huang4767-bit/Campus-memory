# 自动入圈逻辑

## 触发时机

用户首次完善资料时（`is_profile_complete` 从 false 变为 true）

## 实现位置

`backend/apps/circles/services.py` → `auto_join_circles()`

## 流程

```
用户完善资料
    ↓
检查 school 和 enrollment_year
    ↓
查找或创建校级圈
    ↓
加入校级圈（status=approved）
    ↓
查找或创建年级圈
    ↓
加入年级圈（status=approved）
```

## 调用位置

`backend/apps/users/serializers.py` → `UserProfileUpdateSerializer.update()`
