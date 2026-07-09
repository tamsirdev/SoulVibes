import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p class="stat-value">{{ stats.total_users }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Sellers</h3>
          <p class="stat-value">{{ stats.total_sellers }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Products</h3>
          <p class="stat-value">{{ stats.total_products }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <p class="stat-value">{{ stats.total_orders }}</p>
        </div>
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <p class="stat-value">\${{ stats.total_revenue }}</p>
        </div>
        <div class="stat-card">
          <h3>Pending Orders</h3>
          <p class="stat-value">{{ stats.pending_orders }}</p>
        </div>
        <div class="stat-card">
          <h3>Low Stock Products</h3>
          <p class="stat-value">{{ stats.low_stock_products }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <a routerLink="/admin/users" class="action-btn">Manage Users</a>
        <a routerLink="/admin/products" class="action-btn">Manage Products</a>
        <a routerLink="/admin/orders" class="action-btn">Manage Orders</a>
        <a routerLink="/admin/settings" class="action-btn">Site Settings</a>
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
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .action-btn {
      padding: 1.5rem;
      background: #1a1a2e;
      color: #fff;
      text-align: center;
      text-decoration: none;
      border-radius: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  stats = {
    total_users: 0,
    total_sellers: 0,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    low_stock_products: 0
  };

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.http.get<any>('http://localhost:8000/api/admin-panel/dashboard/')
      .subscribe(stats => {
        this.stats = stats;
      });
  }
}
