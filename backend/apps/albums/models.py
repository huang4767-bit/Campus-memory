"""
相册模型 / Album Models
"""

from django.db import models
from django.conf import settings


class AlbumPhoto(models.Model):
    """
    相册照片模型 / Album Photo Model
    班级云相册功能，仅班级圈可用
    """

    # 所属圈子（仅班级圈）/ Related circle (class circles only)
    circle = models.ForeignKey(
        'circles.Circle',
        on_delete=models.CASCADE,
        related_name='album_photos',
        verbose_name='所属圈子'
    )

    # 上传者 / Uploader
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_photos',
        verbose_name='上传者'
    )

    # 图片URL / Image URL
    image = models.ImageField(
        upload_to='albums/%Y/%m/',
        verbose_name='图片'
    )

    # 照片备注 / Description
    description = models.TextField(
        max_length=500,
        blank=True,
        default='',
        verbose_name='照片备注'
    )

    # 拍摄时间 / Taken at
    taken_at = models.DateField(
        null=True,
        blank=True,
        verbose_name='拍摄时间'
    )

    # 上传时间 / Created at
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='上传时间'
    )

    class Meta:
        db_table = 'album_photos'
        verbose_name = '相册照片'
        verbose_name_plural = '相册照片'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.circle.name} - {self.uploader.username}"
