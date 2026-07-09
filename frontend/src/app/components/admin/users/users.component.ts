import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [],
  template: `
    <div class="users-container">
      <h1>Manage Users</h1>

      @if (loading) {
        <div class="loading">Loading users...</div>
      } @else {
        <div class="users-list">
          @for (user of users; track user.id) {
            <div class="user-card">
              <div class="user-info">
                <h3>{{ user.name }}</h3>
                <p>{{ user.email }}</p>
                <span class="role" [class]="user.role">{{ user.role }}</span>
              </div>
              <div class="user-actions">
                <button class="btn-edit" (click)="editUser(user)">Edit</button>
                <button class="btn-delete" (click)="deleteUser(user.id)">Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .users-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    h1 {
      color: #1a1a2e;
      margin-bottom: 2rem;
    }
    .users-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .user-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .user-info h3 {
      margin-bottom: 0.25rem;
      color: #1a1a2e;
    }
    .user-info p {
      color: #666;
      margin-bottom: 0.5rem;
    }
    .role {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .role.user {
      background: #e3f2fd;
      color: #1976d2;
    }
    .role.seller {
      background: #e8f5e9;
      color: #388e3c;
    }
    .role.admin {
      background: #fce4ec;
      color: #c62828;
    }
    .user-actions {
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
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
  `]
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);

  users: User[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any>('http://localhost:8000/api/admin-panel/users/')
      .subscribe({
        next: (response) => {
          this.users = response.results || response;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  editUser(user: User): void {
    // TODO: Implement edit user modal
    alert('Edit user: ' + user.email);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:8000/api/admin-panel/users/${id}/`)
        .subscribe(() => {
          this.loadUsers();
        });
    }
  }
}
