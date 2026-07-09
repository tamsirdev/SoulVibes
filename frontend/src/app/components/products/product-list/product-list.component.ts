import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product, Category } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="products-container">
      <aside class="filters">
        <h3>Filters</h3>

        <div class="filter-group">
          <label>Search</label>
          <input type="text" [(ngModel)]="filters.search" (change)="applyFilters()" placeholder="Search products...">
        </div>

        <div class="filter-group">
          <label>Category</label>
          <select [(ngModel)]="filters.category" (change)="applyFilters()">
            <option value="">All Categories</option>
            @for (category of categories; track category.id) {
              <option [value]="category.slug">{{ category.name }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label>Price Range</label>
          <input type="number" [(ngModel)]="filters.min_price" (change)="applyFilters()" placeholder="Min">
          <input type="number" [(ngModel)]="filters.max_price" (change)="applyFilters()" placeholder="Max">
        </div>

        <div class="filter-group">
          <label>Sort By</label>
          <select [(ngModel)]="filters.sort" (change)="applyFilters()">
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <button class="btn-secondary" (click)="clearFilters()">Clear Filters</button>
      </aside>

      <main class="product-grid">
        @if (loading) {
          <div class="loading">Loading products...</div>
        } @else if (products.length === 0) {
          <div class="no-products">No products found</div>
        } @else {
          @for (product of products; track product.id) {
            <div class="product-card">
              <a [routerLink]="['/products', product.slug]">
                <div class="product-image">
                  @if (product.images.length > 0) {
                    <img [src]="product.images[0].image" [alt]="product.name">
                  } @else {
                    <div class="placeholder-image">No Image</div>
                  }
                </div>
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="category">{{ product.category_name }}</p>
                  <p class="price">\${{ product.price }}</p>
                  <p class="rating">
                    @for (star of [1,2,3,4,5]; track star) {
                      <span class="star" [class.filled]="star <= product.average_rating">&#9733;</span>
                    }
                    ({{ product.review_count }})
                  </p>
                </div>
              </a>
              <button class="btn-add-cart" (click)="addToCart(product.id)" [disabled]="product.stock === 0">
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          }
        }
      </main>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }
    .filters {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      height: fit-content;
    }
    .filters h3 {
      margin-bottom: 1rem;
      color: #1a1a2e;
    }
    .filter-group {
      margin-bottom: 1rem;
    }
    .filter-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
    }
    .filter-group input, .filter-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-secondary {
      width: 100%;
      padding: 0.75rem;
      background: #666;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .product-card a {
      text-decoration: none;
      color: inherit;
    }
    .product-image {
      height: 200px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .product-image img {
      max-height: 100%;
      max-width: 100%;
      object-fit: cover;
    }
    .placeholder-image {
      color: #999;
    }
    .product-info {
      padding: 1rem;
    }
    .product-info h3 {
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .category {
      color: #666;
      font-size: 0.9rem;
    }
    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #e94560;
      margin: 0.5rem 0;
    }
    .btn-add-cart {
      width: 100%;
      padding: 1rem;
      background: #e94560;
      color: #fff;
      border: none;
      cursor: pointer;
    }
    .btn-add-cart:disabled {
      background: #ccc;
    }
    .loading, .no-products {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  filters: any = {
    search: '',
    category: '',
    min_price: '',
    max_price: '',
    sort: ''
  };

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.filters.category = params['category'];
      }
      this.loadProducts();
    });
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = response.results || response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      category: '',
      min_price: '',
      max_price: '',
      sort: ''
    };
    this.loadProducts();
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        alert('Added to cart!');
      }
    });
  }
}
