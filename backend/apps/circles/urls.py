"""
话题圈路由 / Circle URLs
"""

from django.urls import path
from .views import (
    MyCircleListView, CircleCreateView, CircleDetailView,
    CircleJoinView, CircleMemberListView,
    CircleApplicationListView, CircleApplicationReviewView,
    CircleTransferView
)

urlpatterns = [
    path('', MyCircleListView.as_view(), name='my-circles'),
    path('create/', CircleCreateView.as_view(), name='circle-create'),
    path('<int:pk>/', CircleDetailView.as_view(), name='circle-detail'),
    path('<int:pk>/join/', CircleJoinView.as_view(), name='circle-join'),
    path('<int:pk>/transfer/', CircleTransferView.as_view(), name='circle-transfer'),
    path('<int:pk>/members/', CircleMemberListView.as_view(), name='circle-members'),
    path('<int:pk>/applications/', CircleApplicationListView.as_view(), name='circle-applications'),
    path('<int:pk>/applications/<int:member_id>/', CircleApplicationReviewView.as_view(), name='circle-application-review'),
]
