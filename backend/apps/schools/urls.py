"""
学校路由 / School URLs
"""

from django.urls import path
from .views import SchoolListCreateView, SchoolDetailView

urlpatterns = [
    path('', SchoolListCreateView.as_view(), name='school-list-create'),
    path('<int:pk>/', SchoolDetailView.as_view(), name='school-detail'),
]
