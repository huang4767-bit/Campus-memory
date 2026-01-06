"""
好友系统路由 / Friend System URLs
"""

from django.urls import path

from .views import (
    SendFriendRequestView,
    PendingRequestListView,
    AcceptFriendRequestView,
    RejectFriendRequestView,
    FriendListView,
    DeleteFriendView,
    BlacklistListView,
    AddToBlacklistView,
    RemoveFromBlacklistView,
)

urlpatterns = [
    # 好友列表 / Friend list
    path('', FriendListView.as_view(), name='friend-list'),
    # 删除好友 / Delete friend
    path('<int:friend_id>/', DeleteFriendView.as_view(), name='friend-delete'),
    # 发送好友请求 / Send friend request
    path('request/', SendFriendRequestView.as_view(), name='friend-request'),
    # 待处理请求列表 / Pending requests
    path('requests/', PendingRequestListView.as_view(), name='friend-requests'),
    # 接受请求 / Accept request
    path('accept/<int:request_id>/', AcceptFriendRequestView.as_view(), name='friend-accept'),
    # 拒绝请求 / Reject request
    path('reject/<int:request_id>/', RejectFriendRequestView.as_view(), name='friend-reject'),
    # 黑名单列表 / Blacklist
    path('blacklist/', BlacklistListView.as_view(), name='blacklist-list'),
    # 添加黑名单 / Add to blacklist (POST)
    path('blacklist/add/', AddToBlacklistView.as_view(), name='blacklist-add'),
    # 解除黑名单 / Remove from blacklist
    path('blacklist/<int:user_id>/', RemoveFromBlacklistView.as_view(), name='blacklist-remove'),
]
