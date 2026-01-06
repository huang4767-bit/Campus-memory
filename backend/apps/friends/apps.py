"""
好友系统应用配置 / Friend System App Config
"""

from django.apps import AppConfig


class FriendsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.friends'
    verbose_name = '好友系统'
