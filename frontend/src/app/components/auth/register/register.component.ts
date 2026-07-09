import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Create Account</h2>
        @if (error) {
          <div class="error">{{ error }}</div>
        }
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" [(ngModel)]="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" [(ngModel)]="phone" name="phone">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required minlength="8">
          </div>
          <div class="form-group">
            <label for="password_confirm">Confirm Password</label>
            <input type="password" id="password_confirm" [(ngModel)]="password_confirm" name="password_confirm" required>
          </div>
          <div class="form-group">
            <label for="role">I want to</label>
            <select id="role" [(ngModel)]="role" name="role">
              <option value="user">Buy products</option>
              <option value="seller">Sell products</option>
            </select>
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>
        <p class="auth-link">
          Already have an account? <a routerLink="/auth/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    .auth-card {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #1a1a2e;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }
    input, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #e94560;
    }
    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-primary:disabled {
      background: #ccc;
    }
    .error {
      background: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .auth-link {
      text-align: center;
      margin-top: 1rem;
    }
    .auth-link a {
      color: #e94560;
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  phone = '';
  password = '';
  password_confirm = '';
  role = 'user';
  loading = false;
  error = '';

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.authService.register({
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      password_confirm: this.password_confirm,
      role: this.role
    }).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = Object.values(err.error).flat().join(', ');
        this.loading = false;
      }
    });
  }
}
