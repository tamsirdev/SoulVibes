import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  template: `
    <div class="products-container">
      <h1>Manage Products</h1>

      @if (loading) {
        <div class="loading">Loading products...</div>
      } @else {
        <div class="products-list">
          @for (product of products; track product.id) {
            <div class="product-card">
              <div class="product-image">
                @if (product.images.length > 0) {
                  <img [src]="product.images[0].image" [alt]="product.name">
                } @else {
                  <div class="placeholder">No Image</div>
                }
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="seller">Seller: {{ product.seller_name }}</p>
                <p class="price">\${{ product.price }}</p>
                <p class="stock">Stock: {{ product.stock }}</p>
              </div>
              <div class="product-actions">
                <button class="btn-delete" (click)="deleteProduct(product.id)">Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    .products-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .product-card {
      display: grid;
      grid-template-columns: 100px 1fr auto;
      gap: 1rem;
      align-items: center;
      background: #fff;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .product-image img {
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
    .product-info h3 {
      margin-bottom: 0.25rem;
      color: #1a1a2e;
    }
    .seller {
      color: #666;
      font-size: 0.9rem;
    }
    .price {
      color: #e94560;
      font-weight: bold;
      font-size: 1.1rem;
    }
    .stock {
      color: #666;
    }
    .btn-delete {
      background: #f44336;
      color: #fff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response.results || response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
