from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
    path('users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('banners/', views.BannerListCreateView.as_view(), name='banner-list'),
    path('banners/<int:pk>/', views.BannerDetailView.as_view(), name='banner-detail'),
    path('settings/', views.SiteSettingsView.as_view(), name='site-settings'),
    path('audit-logs/', views.AuditLogListView.as_view(), name='audit-log-list'),
]
