from rest_framework import serializers
from .models import Banner, SiteSettings, AuditLog
from users.serializers import UserSerializer


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'title', 'image', 'link', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = ('id', 'site_name', 'site_description', 'contact_email',
                  'contact_phone', 'address', 'social_facebook',
                  'social_instagram', 'social_twitter')
        read_only_fields = ('id',)


class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = ('id', 'user_email', 'action', 'model_name', 'object_id', 'details', 'created_at')
        read_only_fields = ('id', 'created_at')


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSerializer.Meta.model
        fields = ('id', 'email', 'name', 'phone', 'role', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')
