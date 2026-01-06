"""
相册路由 / Album URLs
"""

from django.urls import path
from .views import CircleAlbumView, AlbumPhotoDetailView

urlpatterns = [
    path('circles/<int:circle_id>/album/', CircleAlbumView.as_view(), name='circle-album'),
    path('album/<int:pk>/', AlbumPhotoDetailView.as_view(), name='album-photo-detail'),
]
