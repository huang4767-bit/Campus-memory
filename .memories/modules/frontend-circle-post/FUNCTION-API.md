# 前端 API 服务文档

## 文件清单

| 文件 | 说明 |
|------|------|
| circle.js | 圈子相关 API |
| post.js | 帖子相关 API |
| interaction.js | 互动相关 API |

## circle.js

| 函数 | 说明 |
|------|------|
| getCircleDetail(id) | 获取圈子详情 |
| getMyCircles() | 获取我的圈子列表 |
| joinCircle(id) | 加入圈子 |
| leaveCircle(id) | 退出圈子 |
| getCircleMembers(id, params) | 获取圈子成员 |

## post.js

| 函数 | 说明 |
|------|------|
| getCirclePosts(circleId, params) | 获取圈子帖子列表 |
| getPostDetail(id) | 获取帖子详情 |
| createPost(circleId, data) | 发布帖子 |
| updatePost(id, data) | 编辑帖子 |
| deletePost(id) | 删除帖子 |

## interaction.js

| 函数 | 说明 |
|------|------|
| togglePostLike(postId) | 帖子点赞/取消 |
| togglePostFavorite(postId) | 帖子收藏/取消 |
| getMyFavorites(params) | 我的收藏列表 |
| getPostComments(postId, params) | 获取评论列表 |
| createComment(postId, data) | 发表评论 |
| deleteComment(commentId) | 删除评论 |
| toggleCommentLike(commentId) | 评论点赞/取消 |

## 统一错误处理

错误在 `request.js` 响应拦截器中统一处理，自动弹出错误提示。

组件中无需写 try-catch，直接调用 API 即可。
