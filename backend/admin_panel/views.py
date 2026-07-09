from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Sum, Count
from products.models import Product, Category
from orders.models import Order
from .models import Banner, SiteSettings, AuditLog
from .serializers import BannerSerializer, SiteSettingsSerializer, AuditLogSerializer

User = get_user_model()


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class AdminDashboardView(generics.GenericAPIView):
    permission_classes = (IsAdmin,)

    def get(self, request):
        data = {
            'total_users': User.objects.count(),
            'total_sellers': User.objects.filter(role='seller').count(),
            'total_products': Product.objects.count(),
            'total_orders': Order.objects.count(),
            'total_revenue': Order.objects.filter(payment_status='completed').aggregate(
                total=Sum('total'))['total'] or 0,
            'pending_orders': Order.objects.filter(status='pending').count(),
            'low_stock_products': Product.objects.filter(stock__lt=10).count(),
        }
        return Response(data)


class AdminUserListView(generics.ListAPIView):
    permission_classes = (IsAdmin,)
    serializer_class = AuditLogSerializer

    def get_queryset(self):
        return User.objects.all()


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdmin,)
    queryset = User.objects.all()
    serializer_class = AuditLogSerializer


class BannerListCreateView(generics.ListCreateAPIView):
    permission_classes = (IsAdmin,)
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer


class BannerDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAdmin,)
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer


class SiteSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAdmin,)
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        settings, _ = SiteSettings.objects.get_or_create(id=1)
        return settings


class AuditLogListView(generics.ListAPIView):
    permission_classes = (IsAdmin,)
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
