import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Product, Review } from '../../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="product-detail">
      @if (loading) {
        <div class="loading">Loading product...</div>
      } @else if (product) {
        <div class="product-container">
          <div class="product-images">
            @if (product.images.length > 0) {
              <div class="main-image">
                <img [src]="product.images[0].image" [alt]="product.name">
              </div>
              <div class="thumbnail-list">
                @for (image of product.images; track image.id) {
                  <img [src]="image.image" [alt]="image.alt_text" class="thumbnail">
                }
              </div>
            } @else {
              <div class="no-image">No images available</div>
            }
          </div>

          <div class="product-info">
            <h1>{{ product.name }}</h1>
            <p class="category">{{ product.category_name }}</p>
            <p class="seller">Sold by: {{ product.seller_name }}</p>

            <div class="rating">
              @for (star of [1,2,3,4,5]; track star) {
                <span class="star" [class.filled]="star <= product.average_rating">&#9733;</span>
              }
              <span>({{ product.review_count }} reviews)</span>
            </div>

            <p class="price">\${{ product.price }}</p>

            <div class="stock">
              @if (product.stock > 0) {
                <span class="in-stock">In Stock ({{ product.stock }} available)</span>
              } @else {
                <span class="out-of-stock">Out of Stock</span>
              }
            </div>

            <div class="quantity">
              <label>Quantity:</label>
              <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stock">
            </div>

            <button class="btn-add-cart" (click)="addToCart()" [disabled]="product.stock === 0">
              {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>

            <div class="description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>
          </div>
        </div>

        <section class="reviews">
          <h2>Customer Reviews</h2>

          <div class="review-form">
            <h3>Write a Review</h3>
            <form (ngSubmit)="submitReview()">
              <div class="form-group">
                <label>Rating</label>
                <select [(ngModel)]="newReview.rating" name="rating" required>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div class="form-group">
                <label>Comment</label>
                <textarea [(ngModel)]="newReview.comment" name="comment" rows="4"></textarea>
              </div>
              <button type="submit" class="btn-primary">Submit Review</button>
            </form>
          </div>

          <div class="reviews-list">
            @for (review of reviews; track review.id) {
              <div class="review-card">
                <div class="review-header">
                  <span class="reviewer">{{ review.user_name }}</span>
                  <span class="review-rating">
                    @for (star of [1,2,3,4,5]; track star) {
                      <span class="star" [class.filled]="star <= review.rating">&#9733;</span>
                    }
                  </span>
                  <span class="review-date">{{ review.created_at | date }}</span>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .product-detail {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .product-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }
    .product-images {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 1rem;
    }
    .main-image {
      text-align: center;
      margin-bottom: 1rem;
    }
    .main-image img {
      max-width: 100%;
      max-height: 400px;
      object-fit: contain;
    }
    .thumbnail-list {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
    }
    .thumbnail {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
    }
    .no-image {
      text-align: center;
      padding: 4rem;
      color: #999;
    }
    .product-info h1 {
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }
    .category {
      color: #666;
      margin-bottom: 0.5rem;
    }
    .seller {
      color: #888;
      margin-bottom: 1rem;
    }
    .rating {
      margin-bottom: 1rem;
    }
    .star {
      color: #ddd;
    }
    .star.filled {
      color: #ffc107;
    }
    .price {
      font-size: 2rem;
      font-weight: bold;
      color: #e94560;
      margin-bottom: 1rem;
    }
    .stock {
      margin-bottom: 1rem;
    }
    .in-stock {
      color: #4caf50;
    }
    .out-of-stock {
      color: #f44336;
    }
    .quantity {
      margin-bottom: 1rem;
    }
    .quantity label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .quantity input {
      width: 100px;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-add-cart {
      width: 100%;
      padding: 1rem;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
      margin-bottom: 2rem;
    }
    .btn-add-cart:disabled {
      background: #ccc;
    }
    .description h3 {
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .reviews {
      border-top: 1px solid #ddd;
      padding-top: 2rem;
    }
    .reviews h2 {
      margin-bottom: 1.5rem;
      color: #1a1a2e;
    }
    .review-form {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .review-form h3 {
      margin-bottom: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-primary {
      background: #e94560;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .review-card {
      background: #fff;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .review-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .reviewer {
      font-weight: bold;
    }
    .review-date {
      color: #999;
      margin-left: auto;
    }
    .review-comment {
      color: #333;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product: Product | null = null;
  reviews: Review[] = [];
  loading = true;
  quantity = 1;
  newReview = {
    rating: 5,
    comment: ''
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadProduct(params['slug']);
    });
  }

  loadProduct(slug: string): void {
    this.loading = true;
    this.productService.getProduct(slug).subscribe({
      next: (product) => {
        this.product = product;
        this.loadReviews(product.id);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadReviews(productId: number): void {
    this.productService.getReviews(productId).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity).subscribe({
        next: () => {
          alert('Added to cart!');
        }
      });
    }
  }

  submitReview(): void {
    if (this.product) {
      this.productService.createReview(this.product.id, this.newReview).subscribe({
        next: (review) => {
          this.reviews.unshift(review);
          this.newReview = { rating: 5, comment: '' };
          alert('Review submitted!');
        }
      });
    }
  }
}
