import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="settings-container">
      <h1>Site Settings</h1>

      @if (loading) {
        <div class="loading">Loading settings...</div>
      } @else {
        <form (ngSubmit)="saveSettings()" class="settings-form">
          <div class="form-group">
            <label for="site_name">Site Name</label>
            <input type="text" id="site_name" [(ngModel)]="settings.site_name" name="site_name">
          </div>
          <div class="form-group">
            <label for="site_description">Site Description</label>
            <textarea id="site_description" [(ngModel)]="settings.site_description" name="site_description" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="contact_email">Contact Email</label>
            <input type="email" id="contact_email" [(ngModel)]="settings.contact_email" name="contact_email">
          </div>
          <div class="form-group">
            <label for="contact_phone">Contact Phone</label>
            <input type="tel" id="contact_phone" [(ngModel)]="settings.contact_phone" name="contact_phone">
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <textarea id="address" [(ngModel)]="settings.address" name="address" rows="2"></textarea>
          </div>

          <h2>Social Media</h2>
          <div class="form-group">
            <label for="social_facebook">Facebook URL</label>
            <input type="url" id="social_facebook" [(ngModel)]="settings.social_facebook" name="social_facebook">
          </div>
          <div class="form-group">
            <label for="social_instagram">Instagram URL</label>
            <input type="url" id="social_instagram" [(ngModel)]="settings.social_instagram" name="social_instagram">
          </div>
          <div class="form-group">
            <label for="social_twitter">Twitter URL</label>
            <input type="url" id="social_twitter" [(ngModel)]="settings.social_twitter" name="social_twitter">
          </div>

          <button type="submit" class="btn-primary">Save Settings</button>
        </form>
      }
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    h2 {
      color: #1a1a2e;
      margin: 2rem 0 1rem;
      padding-top: 1rem;
      border-top: 1px solid #ddd;
    }
    .settings-form {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .btn-primary {
      background: #e94560;
      color: #fff;
      padding: 1rem 2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class SettingsComponent implements OnInit {
  private http = inject(HttpClient);

  settings = {
    site_name: 'SoulVibe',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    social_facebook: '',
    social_instagram: '',
    social_twitter: ''
  };
  loading = true;

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.http.get<any>('http://localhost:8000/api/admin-panel/settings/')
      .subscribe({
        next: (settings) => {
          this.settings = settings;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  saveSettings(): void {
    this.http.put('http://localhost:8000/api/admin-panel/settings/', this.settings)
      .subscribe({
        next: () => {
          alert('Settings saved!');
        },
        error: (err) => {
          alert('Error saving settings');
        }
      });
  }
}
