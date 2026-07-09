import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User, Address } from '../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="profile-container">
      <h1>My Profile</h1>

      <div class="profile-content">
        <div class="profile-section">
          <h2>Personal Information</h2>
          <form (ngSubmit)="updateProfile()">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" [(ngModel)]="user.name" name="name">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" [value]="user.email" disabled>
            </div>
            <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tel" id="phone" [(ngModel)]="user.phone" name="phone">
            </div>
            <button type="submit" class="btn-primary">Update Profile</button>
          </form>
        </div>

        <div class="profile-section">
          <h2>My Addresses</h2>
          <div class="addresses">
            @for (address of addresses; track address.id) {
              <div class="address-card">
                <p>{{ address.street }}</p>
                <p>{{ address.city }}, {{ address.state }} {{ address.zip_code }}</p>
                <p>{{ address.country }}</p>
                @if (address.is_default) {
                  <span class="default-badge">Default</span>
                }
                <button class="btn-delete" (click)="deleteAddress(address.id)">Delete</button>
              </div>
            }
          </div>

          <h3>Add New Address</h3>
          <form (ngSubmit)="addAddress()">
            <div class="form-group">
              <label for="street">Street</label>
              <input type="text" id="street" [(ngModel)]="newAddress.street" name="street" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input type="text" id="city" [(ngModel)]="newAddress.city" name="city" required>
              </div>
              <div class="form-group">
                <label for="state">State</label>
                <input type="text" id="state" [(ngModel)]="newAddress.state" name="state" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="zip_code">ZIP Code</label>
                <input type="text" id="zip_code" [(ngModel)]="newAddress.zip_code" name="zip_code" required>
              </div>
              <div class="form-group">
                <label for="country">Country</label>
                <input type="text" id="country" [(ngModel)]="newAddress.country" name="country" required>
              </div>
            </div>
            <button type="submit" class="btn-primary">Add Address</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    .profile-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .profile-section {
      background: #fff;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .profile-section h2 {
      margin-bottom: 1.5rem;
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
    .form-group input {
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
    .btn-primary {
      background: #e94560;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .addresses {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .address-card {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      position: relative;
    }
    .default-badge {
      display: inline-block;
      background: #e94560;
      color: #fff;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
    .btn-delete {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      color: #f44336;
      cursor: pointer;
    }
    h3 {
      margin-bottom: 1rem;
      color: #1a1a2e;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);

  user: User = {
    id: 0,
    email: '',
    name: '',
    phone: '',
    role: 'user',
    created_at: ''
  };
  addresses: Address[] = [];
  newAddress = {
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: ''
  };

  ngOnInit(): void {
    const currentUser = this.authService.user();
    if (currentUser) {
      this.user = { ...currentUser };
    }
  }

  updateProfile(): void {
    // TODO: Implement profile update
    alert('Profile updated!');
  }

  addAddress(): void {
    // TODO: Implement add address
    alert('Address added!');
    this.newAddress = {
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: ''
    };
  }

  deleteAddress(id: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      // TODO: Implement delete address
      alert('Address deleted!');
    }
  }
}
