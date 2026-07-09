import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="orders-container">
      <h1>My Orders</h1>

      @if (loading) {
        <div class="loading">Loading orders...</div>
      } @else if (orders.length === 0) {
        <div class="no-orders">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="orders-list">
          @for (order of orders; track order.id) {
            <div class="order-card">
              <div class="order-header">
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="order-date">{{ order.created_at | date }}</span>
                <span class="order-status" [class]="order.status">{{ order.status }}</span>
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
    .order-status {
      margin-left: auto;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .order-status.pending {
      background: #fff3e0;
      color: #f57c00;
    }
    .order-status.processing {
      background: #e3f2fd;
      color: #1976d2;
    }
    .order-status.shipped {
      background: #e8f5e9;
      color: #388e3c;
    }
    .order-status.delivered {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .order-status.cancelled {
      background: #ffebee;
      color: #c62828;
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
    }
    .no-orders h2 {
      margin-bottom: 1rem;
    }
    .btn-primary {
      display: inline-block;
      background: #e94560;
      color: #fff;
      padding: 1rem 2rem;
      text-decoration: none;
      border-radius: 4px;
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
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
