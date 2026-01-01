from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from apps.users.urls import profile_urlpatterns
from apps.posts.views import ImageUploadView, CirclePostListView, MyFavoriteListView
from apps.posts.urls import comment_urlpatterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.users.urls")),
    path("api/v1/users/", include(profile_urlpatterns)),
    path("api/v1/schools/", include("apps.schools.urls")),
    path("api/v1/circles/", include("apps.circles.urls")),
    path("api/v1/posts/", include("apps.posts.urls")),
    # 图片上传
    path("api/v1/upload/image/", ImageUploadView.as_view(), name='image-upload'),
    # 圈子帖子列表
    path("api/v1/circles/<int:circle_id>/posts/", CirclePostListView.as_view(), name='circle-posts'),
    # 评论相关
    path("api/v1/", include(comment_urlpatterns)),
    # 我的收藏
    path("api/v1/users/me/favorites/", MyFavoriteListView.as_view(), name='my-favorites'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
