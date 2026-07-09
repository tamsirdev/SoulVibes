import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { Cart } from '../../../models/cart.model';
import { Address } from '../../../models/user.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>

      @if (loading) {
        <div class="loading">Loading...</div>
      } @else if (!cart || cart.items.length === 0) {
        <div class="empty-cart">
          <h2>Your cart is empty</h2>
          <a routerLink="/products" class="btn-primary">Continue Shopping</a>
        </div>
      } @else {
        <div class="checkout-content">
          <div class="checkout-form">
            <div class="step">
              <h2>1. Shipping Address</h2>
              @if (addresses.length > 0) {
                <div class="address-list">
                  @for (address of addresses; track address.id) {
                    <label class="address-option">
                      <input type="radio" name="shipping" [value]="address.id" [(ngModel)]="shippingAddressId">
                      <span>{{ address.street }}, {{ address.city }}, {{ address.state }} {{ address.zip_code }}</span>
                    </label>
                  }
                </div>
              }
              <p class="add-address">No saved addresses. <a routerLink="/user/profile">Add one</a></p>
            </div>

            <div class="step">
              <h2>2. Payment Method</h2>
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" name="payment" value="stripe" [(ngModel)]="paymentMethod">
                  <span>Credit/Debit Card (Stripe)</span>
                </label>
                <label class="payment-option">
                  <input type="radio" name="payment" value="paypal" [(ngModel)]="paymentMethod">
                  <span>PayPal</span>
                </label>
              </div>
            </div>

            <div class="step">
              <h2>3. Order Notes (Optional)</h2>
              <textarea [(ngModel)]="notes" placeholder="Any special instructions?" rows="3"></textarea>
            </div>
          </div>

          <div class="order-summary">
            <h2>Order Summary</h2>
            @for (item of cart.items; track item.id) {
              <div class="summary-item">
                <span>{{ item.product.name }} x {{ item.quantity }}</span>
                <span>\${{ item.subtotal }}</span>
              </div>
            }
            <div class="summary-row">
              <span>Subtotal</span>
              <span>\${{ cart.total }}</span>
            </div>
            <div class="summary-row">
              <span>Tax (10%)</span>
              <span>\${{ (cart.total * 0.1).toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>{{ cart.total >= 50 ? 'Free' : '$5.00' }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>\${{ calculateTotal() }}</span>
            </div>

            @if (error) {
              <div class="error">{{ error }}</div>
            }

            <button class="btn-place-order" (click)="placeOrder()" [disabled]="!canPlaceOrder() || submitting">
              {{ submitting ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }
    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .step {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .step h2 {
      margin-bottom: 1rem;
      color: #1a1a2e;
    }
    .address-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .address-option, .payment-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }
    .address-option:hover, .payment-option:hover {
      border-color: #e94560;
    }
    .add-address {
      margin-top: 1rem;
    }
    .add-address a {
      color: #e94560;
    }
    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
    }
    .order-summary {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      height: fit-content;
    }
    .order-summary h2 {
      margin-bottom: 1.5rem;
      color: #1a1a2e;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .summary-row.total {
      border-top: 2px solid #1a1a2e;
      padding-top: 0.5rem;
      margin-top: 0.5rem;
      font-size: 1.2rem;
      font-weight: bold;
    }
    .error {
      background: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .btn-place-order {
      width: 100%;
      padding: 1rem;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      margin-top: 1rem;
    }
    .btn-place-order:disabled {
      background: #ccc;
    }
    .empty-cart {
      text-align: center;
      padding: 4rem;
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
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cart: Cart | null = null;
  addresses: Address[] = [];
  loading = true;
  shippingAddressId: number | null = null;
  paymentMethod = 'stripe';
  notes = '';
  submitting = false;
  error = '';

  ngOnInit(): void {
    this.loadCart();
    this.loadAddresses();
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

  loadAddresses(): void {
    // This would typically come from an address service
    // For now, we'll use an empty array
    this.addresses = [];
  }

  calculateTotal(): string {
    if (!this.cart) return '0.00';
    const tax = this.cart.total * 0.1;
    const shipping = this.cart.total >= 50 ? 0 : 5;
    return (this.cart.total + tax + shipping).toFixed(2);
  }

  canPlaceOrder(): boolean {
    return this.shippingAddressId !== null && this.paymentMethod !== '';
  }

  placeOrder(): void {
    if (!this.canPlaceOrder()) return;

    this.submitting = true;
    this.error = '';

    this.orderService.createOrder({
      shipping_address_id: this.shippingAddressId,
      billing_address_id: this.shippingAddressId,
      payment_method: this.paymentMethod,
      notes: this.notes
    }).subscribe({
      next: (order) => {
        this.cartService.updateCartCount();
        this.router.navigate(['/user/orders']);
        alert('Order placed successfully!');
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to place order';
        this.submitting = false;
      }
    });
  }
}
