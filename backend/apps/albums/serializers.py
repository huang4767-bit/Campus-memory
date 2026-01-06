"""
相册序列化器 / Album Serializers
"""

from rest_framework import serializers
from .models import AlbumPhoto
from common.serializers import UserBriefSerializer


class AlbumPhotoSerializer(serializers.ModelSerializer):
    """
    相册照片序列化器 / Album Photo Serializer
    """
    uploader = UserBriefSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AlbumPhoto
        fields = [
            'id', 'uploader', 'image_url', 'description',
            'taken_at', 'created_at'
        ]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class AlbumPhotoUploadSerializer(serializers.Serializer):
    """
    相册照片上传序列化器 / Album Photo Upload Serializer
    """
    image = serializers.ImageField()
    description = serializers.CharField(
        max_length=500,
        required=False,
        allow_blank=True,
        default=''
    )
    taken_at = serializers.DateField(required=False, allow_null=True)
