from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from decimal import Decimal
from .models import Order, OrderItem
from cart.models import Cart
from users.models import Address
from .serializers import OrderSerializer, CreateOrderSerializer, OrderStatusSerializer


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class CreateOrderView(generics.CreateAPIView):
    serializer_class = CreateOrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_object_or_404(Cart, user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        shipping_address = get_object_or_404(
            Address, id=serializer.validated_data['shipping_address_id'], user=request.user
        )
        billing_address = None
        if serializer.validated_data.get('billing_address_id'):
            billing_address = get_object_or_404(
                Address, id=serializer.validated_data['billing_address_id'], user=request.user
            )

        subtotal = cart.total
        tax = subtotal * Decimal('0.1')
        shipping_cost = Decimal('0.00') if subtotal >= 50 else Decimal('5.00')
        total = subtotal + tax + shipping_cost

        order = Order.objects.create(
            user=request.user,
            shipping_address=shipping_address,
            billing_address=billing_address or shipping_address,
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            total=total,
            notes=serializer.validated_data.get('notes', ''),
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.name,
                product_price=cart_item.product.price,
                quantity=cart_item.quantity,
                subtotal=cart_item.subtotal,
            )
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()

        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class SellerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(items__product__seller=self.request.user).distinct()


class UpdateOrderStatusView(generics.UpdateAPIView):
    serializer_class = OrderStatusSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(items__product__seller=self.request.user).distinct()

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order.status = serializer.validated_data['status']
        order.save()
        return Response(OrderSerializer(order).data)
