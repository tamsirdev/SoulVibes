# SoulVibe E-commerce Platform

A full-stack e-commerce website built with Django REST Framework and Angular.

## Features

### User Features
- User registration and authentication (JWT)
- Browse products with filtering and sorting
- Shopping cart management
- Checkout with multiple payment options
- Order history and tracking
- Profile and address management

### Seller Features
- Seller dashboard with analytics
- Product management (CRUD operations)
- Order management and status updates

### Admin Features
- Admin dashboard with site statistics
- User management
- Product management
- Order management
- Site settings configuration

## Tech Stack

### Backend
- Python 3.14
- Django 6.0
- Django REST Framework
- MySQL
- JWT Authentication (SimpleJWT)

### Frontend
- Angular 19
- TypeScript
- SCSS

## Project Structure

```
SoulVibes/
├── backend/                 # Django backend
│   ├── soulvibe/           # Django project settings
│   ├── users/              # User authentication & management
│   ├── products/           # Product catalog
│   ├── cart/               # Shopping cart
│   ├── orders/             # Order management
│   └── admin_panel/        # Admin functionality
├── frontend/               # Angular frontend
│   └── src/app/
│       ├── components/     # UI components
│       ├── services/       # API services
│       ├── models/         # TypeScript models
│       └── guards/         # Route guards
└── requirements.txt        # Python dependencies
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```

4. Create MySQL database:
   ```sql
   CREATE DATABASE soulvibe_db;
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   ng serve
   ```

4. Open browser and navigate to `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Products
- `GET /api/products/` - List products
- `GET /api/products/<slug>/` - Product detail
- `GET /api/products/categories/` - List categories

### Cart
- `GET /api/cart/` - Get cart
- `POST /api/cart/add/` - Add to cart
- `PUT /api/cart/item/<id>/` - Update cart item
- `DELETE /api/cart/item/<id>/remove/` - Remove from cart

### Orders
- `GET /api/orders/` - List orders
- `POST /api/orders/create/` - Create order

## Environment Variables

Create a `.env` file in the backend directory:

```
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=soulvibe_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

## License

This project is for educational purposes.
