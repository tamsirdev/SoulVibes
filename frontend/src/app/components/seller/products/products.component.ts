import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="products-container">
      <div class="header">
        <h1>My Products</h1>
        <button class="btn-primary" (click)="showAddForm = true">Add Product</button>
      </div>

      @if (showAddForm || editingProduct) {
        <div class="product-form">
          <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
          <form (ngSubmit)="saveProduct()">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" [(ngModel)]="productForm.name" name="name" required>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" [(ngModel)]="productForm.description" name="description" rows="4" required></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="price">Price</label>
                <input type="number" id="price" [(ngModel)]="productForm.price" name="price" step="0.01" required>
              </div>
              <div class="form-group">
                <label for="stock">Stock</label>
                <input type="number" id="stock" [(ngModel)]="productForm.stock" name="stock" required>
              </div>
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" [(ngModel)]="productForm.category" name="category" required>
                <option value="">Select Category</option>
                @for (category of categories; track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="cancelEdit()">Cancel</button>
              <button type="submit" class="btn-primary">Save Product</button>
            </div>
          </form>
        </div>
      }

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
              <p class="price">\${{ product.price }}</p>
              <p class="stock" [class.low]="product.stock < 10">
                Stock: {{ product.stock }} {{ product.stock < 10 ? '(Low)' : '' }}
              </p>
            </div>
            <div class="product-actions">
              <button class="btn-edit" (click)="editProduct(product)">Edit</button>
              <button class="btn-delete" (click)="deleteProduct(product.id)">Delete</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .products-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .header h1 {
      color: #1a1a2e;
    }
    .btn-primary {
      background: #e94560;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .product-form {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .product-form h2 {
      margin-bottom: 1rem;
      color: #1a1a2e;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }
    .form-group input, .form-group select, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    .btn-secondary {
      background: #666;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
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
      margin-bottom: 0.5rem;
      color: #1a1a2e;
    }
    .price {
      color: #e94560;
      font-weight: bold;
      font-size: 1.1rem;
    }
    .stock {
      color: #666;
    }
    .stock.low {
      color: #f44336;
    }
    .product-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-edit {
      background: #1976d2;
      color: #fff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-delete {
      background: #f44336;
      color: #fff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);

  products: Product[] = [];
  categories: any[] = [];
  showAddForm = false;
  editingProduct: Product | null = null;
  productForm = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: ''
  };

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getSellerProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productForm = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category.toString()
    };
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingProduct = null;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: ''
    };
  }

  saveProduct(): void {
    const slug = this.productForm.name.toLowerCase().replace(/\s+/g, '-');
    const data = {
      ...this.productForm,
      slug,
      category: parseInt(this.productForm.category)
    };

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, data).subscribe(() => {
        this.loadProducts();
        this.cancelEdit();
      });
    } else {
      this.productService.createProduct(data).subscribe(() => {
        this.loadProducts();
        this.cancelEdit();
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }
}
