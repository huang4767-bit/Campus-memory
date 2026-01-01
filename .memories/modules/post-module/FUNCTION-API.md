# 帖子模块 API 实现

## 文件结构

```
backend/apps/posts/
├── models.py      # Post 模型
├── serializers.py # 序列化器
├── views.py       # 视图
└── urls.py        # 路由

backend/common/
├── sensitive.py       # 敏感词过滤
└── sensitive_words.txt # 敏感词库
```

## 关键代码位置

| 功能 | 文件 | 行号 |
|------|------|------|
| Post 模型 | apps/posts/models.py | 9 |
| 图片上传 | apps/posts/views.py | 21 |
| 帖子列表 | apps/posts/views.py | 67 |
| 帖子详情 | apps/posts/views.py | 144 |
| 敏感词过滤 | common/sensitive.py | 74 |
| 敏感词校验函数 | common/sensitive.py | 82 |

## 公共模块复用

### 敏感词校验

`common/sensitive.py` 提供了通用校验函数：

```python
from common.sensitive import validate_sensitive_field

def validate_content(self, value):
    return validate_sensitive_field(value, '内容')
```

### 公共序列化器

`common/serializers.py` 提供了用户简要信息序列化器：

```python
from common.serializers import UserBriefSerializer

class PostSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
```

### 权限检查

`apps/circles/services.py` 提供了管理员权限检查：

```python
from apps.circles.services import is_circle_admin

# 检查是否是圈主或管理员
if not is_circle_admin(circle, request.user):
    return error_response('无权限', 403)
```

使用位置：PostPinView、CommentDetailView
