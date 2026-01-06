"""
相册管理后台 / Album Admin
"""

from django.contrib import admin
from .models import AlbumPhoto


@admin.register(AlbumPhoto)
class AlbumPhotoAdmin(admin.ModelAdmin):
    """相册照片管理 / Album Photo Admin"""
    list_display = ['id', 'circle', 'uploader', 'taken_at', 'created_at']
    list_filter = ['created_at']
    search_fields = ['circle__name', 'uploader__username', 'description']
    raw_id_fields = ['circle', 'uploader']
