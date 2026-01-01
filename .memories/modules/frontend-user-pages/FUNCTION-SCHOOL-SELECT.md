# 学校选择器组件

## 组件路径

`frontend/src/components/SchoolSelect/index.jsx`

## 功能说明

三级联动选择器：省份 → 城市 → 学校

## Props

| 属性 | 类型 | 说明 |
|------|------|------|
| value | object | 选中的学校对象 |
| onChange | function | 选择变化回调 |
| disabled | boolean | 是否禁用 |

## 使用示例

```jsx
<Form.Item name="school">
  <SchoolSelect />
</Form.Item>
```

## 关键特性

1. **省市联动**：选择省份后自动加载城市
2. **学校搜索**：支持输入搜索过滤
3. **新增学校**：找不到时可弹窗添加

## 依赖的 API

- `GET /api/v1/schools/regions/provinces/`
- `GET /api/v1/schools/regions/cities/?province=xxx`
- `GET /api/v1/schools/?province=xxx&city=xxx`
- `POST /api/v1/schools/`
