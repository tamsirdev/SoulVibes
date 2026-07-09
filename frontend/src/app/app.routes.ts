import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, SellerGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./components/products/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'products/:slug', loadComponent: () => import('./components/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'auth/login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'auth/register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent), canActivate: [AuthGuard] },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [AuthGuard] },
  { path: 'user/profile', loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'user/orders', loadComponent: () => import('./components/user/orders/orders.component').then(m => m.OrdersComponent), canActivate: [AuthGuard] },
  { path: 'seller/dashboard', loadComponent: () => import('./components/seller/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [SellerGuard] },
  { path: 'seller/products', loadComponent: () => import('./components/seller/products/products.component').then(m => m.ProductsComponent), canActivate: [SellerGuard] },
  { path: 'seller/orders', loadComponent: () => import('./components/seller/orders/orders.component').then(m => m.OrdersComponent), canActivate: [SellerGuard] },
  { path: 'admin/dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AdminGuard] },
  { path: 'admin/users', loadComponent: () => import('./components/admin/users/users.component').then(m => m.UsersComponent), canActivate: [AdminGuard] },
  { path: 'admin/products', loadComponent: () => import('./components/admin/products/products.component').then(m => m.ProductsComponent), canActivate: [AdminGuard] },
  { path: 'admin/orders', loadComponent: () => import('./components/admin/orders/orders.component').then(m => m.OrdersComponent), canActivate: [AdminGuard] },
  { path: 'admin/settings', loadComponent: () => import('./components/admin/settings/settings.component').then(m => m.SettingsComponent), canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];
