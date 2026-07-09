import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { Product } from '../../../models/product.model';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-container">
      <h1>Seller Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Products</h3>
          <p class="stat-value">{{ products.length }}</p>
        </div>
        <div class="stat-card">
          <h3>Pending Orders</h3>
          <p class="stat-value">{{ pendingOrders }}</p>
        </div>
        <div class="stat-card">
          <h3>Low Stock Products</h3>
          <p class="stat-value">{{ lowStockProducts }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <a routerLink="/seller/products" class="action-btn">Manage Products</a>
        <a routerLink="/seller/orders" class="action-btn">View Orders</a>
      </div>

      <div class="recent-section">
        <h2>Recent Orders</h2>
        @if (recentOrders.length > 0) {
          <div class="orders-list">
            @for (order of recentOrders; track order.id) {
              <div class="order-item">
                <span>Order #{{ order.id }}</span>
                <span>{{ order.created_at | date }}</span>
                <span class="status" [class]="order.status">{{ order.status }}</span>
                <span>\${{ order.total }}</span>
              </div>
            }
          </div>
        } @else {
          <p class="no-data">No recent orders</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      text-align: center;
    }
    .stat-card h3 {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #e94560;
    }
    .quick-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .action-btn {
      flex: 1;
      padding: 1rem;
      background: #1a1a2e;
      color: #fff;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
    }
    .recent-section {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .recent-section h2 {
      margin-bottom: 1rem;
      color: #1a1a2e;
    }
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .order-item {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 1rem;
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .status.pending {
      background: #fff3e0;
      color: #f57c00;
    }
    .status.processing {
      background: #e3f2fd;
      color: #1976d2;
    }
    .status.shipped {
      background: #e8f5e9;
      color: #388e3c;
    }
    .no-data {
      color: #666;
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  products: Product[] = [];
  recentOrders: Order[] = [];
  pendingOrders = 0;
  lowStockProducts = 0;

  ngOnInit(): void {
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts(): void {
    this.productService.getSellerProducts().subscribe(products => {
      this.products = products;
      this.lowStockProducts = products.filter(p => p.stock < 10).length;
    });
  }

  loadOrders(): void {
    this.orderService.getSellerOrders().subscribe(orders => {
      this.recentOrders = orders.slice(0, 5);
      this.pendingOrders = orders.filter(o => o.status === 'pending').length;
    });
  }
}
