import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8000/api/cart';
  private cartItems = signal<number>(0);

  itemCount = this.cartItems.asReadonly();

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add/`, { product_id: productId, quantity })
      .pipe(
        tap(cart => this.cartItems.set(cart.item_count))
      );
  }

  updateCartItem(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/item/${itemId}/`, { quantity })
      .pipe(
        tap(cart => this.cartItems.set(cart.item_count))
      );
  }

  removeFromCart(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/item/${itemId}/remove/`)
      .pipe(
        tap(cart => this.cartItems.set(cart.item_count))
      );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear/`)
      .pipe(
        tap(() => this.cartItems.set(0))
      );
  }

  updateCartCount(): void {
    this.getCart().subscribe(cart => {
      this.cartItems.set(cart.item_count);
    });
  }
}
