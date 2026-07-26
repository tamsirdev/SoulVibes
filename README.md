# SoulVibe E-commerce Platform

A full-stack e-commerce website built with Django REST Framework and Angular.

[![CI/CD Pipeline](https://github.com/tamsirdev/SoulVibes/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/tamsirdev/SoulVibes/actions/workflows/ci-cd.yml)

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

### DevOps
- GitHub Actions (CI/CD)
- Docker & Docker Compose
- Railway (Backend Hosting)
- Netlify (Frontend Hosting)

## Project Structure

```
SoulVibes/
├── .github/workflows/      # GitHub Actions CI/CD
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
├── docker-compose.yml      # Docker orchestration
└── requirements.txt        # Python dependencies
```

## Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/tamsirdev/SoulVibes.git
cd SoulVibes

# Start with Docker Compose
docker-compose up

# Or run manually:
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver 8000

# Frontend (new terminal)
cd frontend
npm install
ng serve
```

### Access URLs
- Frontend: http://localhost:4200
- Backend API: http://localhost:8000
- Django Admin: http://localhost:8000/admin

## Deployment (Free Tier)

### Backend - Railway
1. Sign up at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - `SECRET_KEY`
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`
   - `DEBUG=False`
4. Railway provides free MySQL database

### Frontend - Netlify
1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist/frontend`
4. Add environment variable:
   - `API_URL`: Your Railway backend URL

### CI/CD Pipeline
The GitHub Actions workflow automatically:
1. Runs backend tests on every push
2. Builds and lints frontend code
3. Deploys backend to Railway on main branch
4. Deploys frontend to Netlify on main branch

### Required GitHub Secrets
Add these in Settings → Secrets → Actions:
- `RAILWAY_TOKEN`: Railway API token
- `NETLIFY_AUTH_TOKEN`: Netlify personal access token
- `NETLIFY_SITE_ID`: Netlify site ID

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
