"""
帖子路由 / Post URLs
"""

from django.urls import path
from .views import (
    ImageUploadView,
    CirclePostListView,
    PostDetailView,
    PostPinView,
    PostCommentListView,
    CommentDetailView,
    PostLikeView,
    CommentLikeView,
    PostFavoriteView,
    MyFavoriteListView
)

urlpatterns = [
    # 帖子详情/编辑/删除
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    # 置顶/精华
    path('<int:pk>/pin/', PostPinView.as_view(), name='post-pin'),
    # 帖子评论
    path('<int:post_id>/comments/', PostCommentListView.as_view(), name='post-comments'),
    # 帖子点赞
    path('<int:pk>/like/', PostLikeView.as_view(), name='post-like'),
    # 帖子收藏
    path('<int:pk>/favorite/', PostFavoriteView.as_view(), name='post-favorite'),
]

# 评论相关路由（在主路由中配置）
comment_urlpatterns = [
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
    path('comments/<int:pk>/like/', CommentLikeView.as_view(), name='comment-like'),
]

# 图片上传和圈子帖子列表在主路由中配置
