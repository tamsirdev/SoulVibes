import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="orders-container">
      <h1>Manage Orders</h1>

      @if (loading) {
        <div class="loading">Loading orders...</div>
      } @else if (orders.length === 0) {
        <div class="no-orders">
          <p>No orders to manage</p>
        </div>
      } @else {
        <div class="orders-list">
          @for (order of orders; track order.id) {
            <div class="order-card">
              <div class="order-header">
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="order-date">{{ order.created_at | date }}</span>
                <select [value]="order.status" (change)="updateStatus(order.id, $event)">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div class="order-items">
                @for (item of order.items; track item.id) {
                  <div class="order-item">
                    <span>{{ item.product_name }}</span>
                    <span>x{{ item.quantity }}</span>
                    <span>\${{ item.subtotal }}</span>
                  </div>
                }
              </div>
              <div class="order-footer">
                <span class="order-total">Total: \${{ order.total }}</span>
                <span class="payment-status">Payment: {{ order.payment_status }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .order-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .order-header {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: #f5f5f5;
    }
    .order-id {
      font-weight: bold;
      color: #1a1a2e;
    }
    .order-date {
      color: #666;
    }
    .order-header select {
      margin-left: auto;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .order-items {
      padding: 1rem;
    }
    .order-item {
      display: flex;
      gap: 1rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .order-footer {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      background: #f5f5f5;
    }
    .order-total {
      font-weight: bold;
      color: #1a1a2e;
    }
    .payment-status {
      color: #666;
    }
    .no-orders {
      text-align: center;
      padding: 4rem;
      color: #666;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getSellerOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStatus(orderId: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const status = target.value;
    this.orderService.updateOrderStatus(orderId, status).subscribe(() => {
      this.loadOrders();
    });
  }
}
