"""
敏感词过滤模块 / Sensitive Word Filter
"""

import os
from pathlib import Path


class SensitiveWordFilter:
    """
    敏感词过滤器 / Sensitive Word Filter
    使用简单的关键词匹配实现
    """

    def __init__(self):
        self.words = set()
        self._load_words()

    def _load_words(self):
        """加载敏感词库 / Load sensitive words"""
        # 敏感词文件路径 / Sensitive words file path
        file_path = Path(__file__).parent / 'sensitive_words.txt'

        if file_path.exists():
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    word = line.strip()
                    if word:
                        self.words.add(word)

    def contains_sensitive_word(self, text):
        """
        检查文本是否包含敏感词 / Check if text contains sensitive words
        返回: (是否包含, 匹配到的敏感词列表)
        """
        if not text:
            return False, []

        found = []
        text_lower = text.lower()
        for word in self.words:
            if word.lower() in text_lower:
                found.append(word)

        return len(found) > 0, found

    def filter_text(self, text, replacement='*'):
        """
        过滤敏感词（替换为*）/ Filter sensitive words
        """
        if not text:
            return text

        result = text
        for word in self.words:
            if word.lower() in result.lower():
                result = result.replace(word, replacement * len(word))

        return result


# 全局单例 / Global singleton
_filter_instance = None


def get_filter():
    """获取过滤器实例 / Get filter instance"""
    global _filter_instance
    if _filter_instance is None:
        _filter_instance = SensitiveWordFilter()
    return _filter_instance


def check_sensitive(text):
    """
    检查敏感词（快捷方法）/ Check sensitive words (shortcut)
    返回: (是否包含, 敏感词列表)
    """
    return get_filter().contains_sensitive_word(text)


def validate_sensitive_field(value, field_name='内容'):
    """
    通用敏感词校验，供序列化器调用 / Generic sensitive word validation for serializers
    Args:
        value: 待校验的文本 / Text to validate
        field_name: 字段名称，用于错误提示 / Field name for error message
    Returns:
        原值（校验通过）/ Original value if passed
    Raises:
        serializers.ValidationError: 包含敏感词时抛出
    """
    from rest_framework import serializers
    has_sensitive, words = check_sensitive(value)
    if has_sensitive:
        raise serializers.ValidationError(f'{field_name}包含敏感词: {", ".join(words)}')
    return value
