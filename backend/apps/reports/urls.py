"""
举报路由 / Report URLs
"""

from django.urls import path
from .views import ReportView, ReportProcessView

urlpatterns = [
    path('', ReportView.as_view(), name='report-list'),
    path('<int:pk>/process/', ReportProcessView.as_view(), name='report-process'),
]
