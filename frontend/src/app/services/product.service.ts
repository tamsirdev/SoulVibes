import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, Review } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.min_price) params = params.set('min_price', filters.min_price);
      if (filters.max_price) params = params.set('max_price', filters.max_price);
      if (filters.sort) params = params.set('sort', filters.sort);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${slug}/`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/create/`, product);
  }

  updateProduct(id: number, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/update/`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/delete/`);
  }

  getSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/seller/`);
  }

  getReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/${productId}/reviews/`);
  }

  createReview(productId: number, review: any): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${productId}/reviews/create/`, review);
  }
}
