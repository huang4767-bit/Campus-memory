# 学校 API 实现

## 文件清单

- `backend/apps/schools/models.py` - School 模型
- `backend/apps/schools/serializers.py` - 序列化器
- `backend/apps/schools/views.py` - 视图
- `backend/apps/schools/urls.py` - 路由
- `backend/apps/schools/regions.py` - 省市数据

## 学校去重逻辑

```python
# name + province + city 联合唯一
unique_together = ['name', 'province', 'city']
```

## 注意事项

1. 学校创建后不可修改
2. 搜索使用 `icontains` 模糊匹配
3. 分页使用 `common.pagination.StandardPagination`
