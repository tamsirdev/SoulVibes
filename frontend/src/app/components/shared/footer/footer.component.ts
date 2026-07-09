import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>SoulVibe</h3>
          <p>Your one-stop shop for everything you love.</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <a routerLink="/products">Products</a>
          <a routerLink="/auth/login">Login</a>
          <a routerLink="/auth/register">Register</a>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: info&#64;soulvibe.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
        <div class="footer-section">
          <h4>Follow Us</h4>
          <div class="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 SoulVibe. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1a2e;
      color: #fff;
      padding: 3rem 0 1rem;
      margin-top: 3rem;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    .footer-section h3, .footer-section h4 {
      margin-bottom: 1rem;
      color: #e94560;
    }
    .footer-section a {
      display: block;
      color: #ccc;
      text-decoration: none;
      margin-bottom: 0.5rem;
    }
    .footer-section a:hover {
      color: #e94560;
    }
    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      margin-top: 2rem;
      border-top: 1px solid #333;
    }
    .social-links {
      display: flex;
      gap: 1rem;
    }
  `]
})
export class FooterComponent {}
