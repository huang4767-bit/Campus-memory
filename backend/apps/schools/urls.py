"""
学校路由 / School URLs
"""

from django.urls import path
from .views import (
    SchoolListCreateView, SchoolDetailView,
    ProvinceListView, CityListView
)

urlpatterns = [
    path('', SchoolListCreateView.as_view(), name='school-list-create'),
    path('<int:pk>/', SchoolDetailView.as_view(), name='school-detail'),
    # 区域接口 / Region APIs
    path('regions/provinces/', ProvinceListView.as_view(), name='province-list'),
    path('regions/cities/', CityListView.as_view(), name='city-list'),
]
