"""
举报序列化器 / Report Serializers
"""

from rest_framework import serializers
from .models import Report
from common.serializers import UserBriefSerializer


class ReportCreateSerializer(serializers.Serializer):
    """
    举报创建序列化器 / Report Create Serializer
    """
    target_type = serializers.ChoiceField(
        choices=['post', 'comment', 'user']
    )
    target_id = serializers.IntegerField(min_value=1)
    reason = serializers.CharField(max_length=500)


class ReportSerializer(serializers.ModelSerializer):
    """
    举报序列化器 / Report Serializer
    """
    reporter = UserBriefSerializer(read_only=True)
    handler = UserBriefSerializer(read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'reporter', 'target_type', 'target_id',
            'reason', 'status', 'handler', 'handler_note',
            'handled_at', 'created_at'
        ]


class ReportProcessSerializer(serializers.Serializer):
    """
    举报处理序列化器 / Report Process Serializer
    """
    action = serializers.ChoiceField(choices=['process', 'reject'])
    note = serializers.CharField(max_length=500, required=False, default='')
