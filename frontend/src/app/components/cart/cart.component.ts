import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { Cart, CartItem } from '../../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>

      @if (loading) {
        <div class="loading">Loading cart...</div>
      } @else if (!cart || cart.items.length === 0) {
        <div class="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="cart-content">
          <div class="cart-items">
            @for (item of cart.items; track item.id) {
              <div class="cart-item">
                <div class="item-image">
                  @if (item.product.images.length > 0) {
                    <img [src]="item.product.images[0].image" [alt]="item.product.name">
                  } @else {
                    <div class="placeholder">No Image</div>
                  }
                </div>
                <div class="item-details">
                  <h3>{{ item.product.name }}</h3>
                  <p class="price">\${{ item.product.price }}</p>
                </div>
                <div class="item-quantity">
                  <button (click)="updateQuantity(item.id, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item.id, item.quantity + 1)" [disabled]="item.quantity >= item.product.stock">+</button>
                </div>
                <div class="item-subtotal">
                  \${{ item.subtotal }}
                </div>
                <button class="btn-remove" (click)="removeItem(item.id)">Remove</button>
              </div>
            }
          </div>

          <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="summary-row">
              <span>Subtotal ({{ cart.item_count }} items)</span>
              <span>\${{ cart.total }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>{{ cart.total >= 50 ? 'Free' : '$5.00' }}</span>
            </div>
            <div class="summary-row">
              <span>Tax (10%)</span>
              <span>\${{ (cart.total * 0.1).toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>\${{ (cart.total + (cart.total >= 50 ? 0 : 5) + cart.total * 0.1).toFixed(2) }}</span>
            </div>
            <a routerLink="/checkout" class="btn-checkout">Proceed to Checkout</a>
            <button class="btn-clear" (click)="clearCart()">Clear Cart</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }
    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      background: #fff;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .item-image img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }
    .placeholder {
      width: 100px;
      height: 100px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }
    .item-details h3 {
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .item-details .price {
      color: #e94560;
      font-weight: bold;
    }
    .item-quantity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .item-quantity button {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .item-quantity button:disabled {
      opacity: 0.5;
    }
    .item-subtotal {
      font-weight: bold;
      color: #1a1a2e;
    }
    .btn-remove {
      background: none;
      border: none;
      color: #f44336;
      cursor: pointer;
    }
    .cart-summary {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      height: fit-content;
    }
    .cart-summary h2 {
      margin-bottom: 1.5rem;
      color: #1a1a2e;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .summary-row.total {
      border-bottom: none;
      font-size: 1.2rem;
      font-weight: bold;
    }
    .btn-checkout {
      display: block;
      width: 100%;
      padding: 1rem;
      background: #e94560;
      color: #fff;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .btn-clear {
      width: 100%;
      padding: 0.75rem;
      background: #666;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .empty-cart {
      text-align: center;
      padding: 4rem;
    }
    .empty-cart h2 {
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
export class CartComponent implements OnInit {
  private cartService = inject(CartService);

  cart: Cart | null = null;
  loading = true;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateQuantity(itemId: number, quantity: number): void {
    this.cartService.updateCartItem(itemId, quantity).subscribe(cart => {
      this.cart = cart;
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe(cart => {
      this.cart = cart;
    });
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe(() => {
        this.cart = null;
      });
    }
  }
}
