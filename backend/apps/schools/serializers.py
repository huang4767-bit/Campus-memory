"""
学校序列化器 / School Serializers
"""

from rest_framework import serializers
from .models import School


class SchoolSerializer(serializers.ModelSerializer):
    """
    学校序列化器 / School Serializer
    用于列表和详情展示
    """
    # 创建者用户名（只读）/ Creator username (read-only)
    created_by_username = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    # 学校类型显示名称 / School type display name
    school_type_display = serializers.CharField(
        source='get_school_type_display',
        read_only=True
    )

    class Meta:
        model = School
        fields = [
            'id', 'name', 'province', 'city', 'district',
            'school_type', 'school_type_display',
            'created_by', 'created_by_username', 'created_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at']


class SchoolCreateSerializer(serializers.ModelSerializer):
    """
    学校创建序列化器 / School Create Serializer
    用于添加新学校
    """

    class Meta:
        model = School
        fields = ['name', 'province', 'city', 'district', 'school_type']

    def validate(self, attrs):
        """检查学校是否已存在 / Check if school already exists"""
        name = attrs.get('name')
        province = attrs.get('province')
        city = attrs.get('city')

        if School.objects.filter(name=name, province=province, city=city).exists():
            raise serializers.ValidationError({
                'name': '该学校已存在，请直接搜索选择'
            })
        return attrs

    def create(self, validated_data):
        """创建学校，自动设置创建者 / Create school with creator"""
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
