from rest_framework import serializers
from .models import Order, OrderItem
from users.serializers import AddressSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_price', 'quantity', 'subtotal')
        read_only_fields = ('id', 'subtotal')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = AddressSerializer(read_only=True)
    billing_address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'status', 'payment_status', 'subtotal', 'tax',
                  'shipping_cost', 'total', 'notes', 'items',
                  'shipping_address', 'billing_address', 'created_at')
        read_only_fields = ('id', 'created_at')


class CreateOrderSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField()
    billing_address_id = serializers.IntegerField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.CharField()


class OrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
