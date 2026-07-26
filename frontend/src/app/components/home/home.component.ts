import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to SoulVibe</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <a routerLink="/products" class="btn-primary">Shop Now</a>
        </div>
      </section>

      <section class="categories">
        <h2>Shop by Category</h2>
        <div class="category-grid">
          @for (category of categories; track category.id) {
            <a [routerLink]="['/products']" [queryParams]="{category: category.slug}" class="category-card">
              <h3>{{ category.name }}</h3>
            </a>
          }
        </div>
      </section>

      <section class="featured">
        <h2>Featured Products</h2>
        <div class="product-grid">
          @for (product of featuredProducts; track product.id) {
            <a [routerLink]="['/products', product.slug]" class="product-card">
              <div class="product-image">
                @if (product.images.length > 0) {
                  <img [src]="product.images[0].image" [alt]="product.name">
                } @else {
                  <div class="placeholder-image">No Image</div>
                }
              </div>
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="price">\${{ product.price }}</p>
                <p class="rating">
                  @for (star of [1,2,3,4,5]; track star) {
                    <span class="star" [class.filled]="star <= product.average_rating">&#9733;</span>
                  }
                  ({{ product.review_count }})
                </p>
              </div>
            </a>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      padding: 6rem 1rem;
      text-align: center;
    }
    .hero-content h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: #ccc;
    }
    .btn-primary {
      display: inline-block;
      background: #e94560;
      color: #fff;
      padding: 1rem 2rem;
      text-decoration: none;
      border-radius: 4px;
      font-size: 1.1rem;
    }
    .categories, .featured {
      max-width: 1200px;
      margin: 3rem auto;
      padding: 0 1rem;
    }
    .categories h2, .featured h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #1a1a2e;
    }
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    .category-card {
      background: #f5f5f5;
      padding: 2rem;
      text-align: center;
      text-decoration: none;
      color: #1a1a2e;
      border-radius: 8px;
      transition: transform 0.3s;
    }
    .category-card:hover {
      transform: translateY(-5px);
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    .product-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    .product-card:hover {
      transform: translateY(-5px);
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
    .price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #e94560;
    }
    .rating {
      color: #666;
    }
    .star {
      color: #ddd;
    }
    .star.filled {
      color: #ffc107;
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  categories: Category[] = [];
  featuredProducts: Product[] = [];

  ngOnInit(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    this.productService.getProducts({ sort: 'newest' }).subscribe(response => {
      this.featuredProducts = response.results || response;
    });
  }
}
