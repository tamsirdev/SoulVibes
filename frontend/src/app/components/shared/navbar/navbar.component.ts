import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">SoulVibe</a>

        <div class="nav-links">
          <a routerLink="/products" class="nav-link">Products</a>

          @if (authService.isLoggedIn()) {
            <a routerLink="/cart" class="nav-link">
              Cart ({{ cartService.itemCount() }})
            </a>

            @if (authService.isSeller() || authService.isAdmin()) {
              <a routerLink="/seller/dashboard" class="nav-link">Seller</a>
            }

            @if (authService.isAdmin()) {
              <a routerLink="/admin/dashboard" class="nav-link">Admin</a>
            }

            <div class="nav-dropdown">
              <button class="nav-link dropdown-toggle">
                {{ authService.user()?.name }}
              </button>
              <div class="dropdown-menu">
                <a routerLink="/user/profile" class="dropdown-item">Profile</a>
                <a routerLink="/user/orders" class="dropdown-item">Orders</a>
                <button (click)="authService.logout()" class="dropdown-item">Logout</button>
              </div>
            </div>
          } @else {
            <a routerLink="/auth/login" class="nav-link">Login</a>
            <a routerLink="/auth/register" class="nav-link btn-primary">Register</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #1a1a2e;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #e94560;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    .nav-link {
      color: #fff;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.1);
    }
    .btn-primary {
      background: #e94560;
      color: #fff;
    }
    .nav-dropdown {
      position: relative;
    }
    .dropdown-toggle {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 1rem;
    }
    .dropdown-menu {
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      background: #16213e;
      border-radius: 4px;
      min-width: 150px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .nav-dropdown:hover .dropdown-menu {
      display: block;
    }
    .dropdown-item {
      display: block;
      padding: 0.75rem 1rem;
      color: #fff;
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }
    .dropdown-item:hover {
      background: rgba(255,255,255,0.1);
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
}
