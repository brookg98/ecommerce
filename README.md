# E-commerce Backend API

A production-ready, modular e-commerce backend built with **FastAPI**, **PostgreSQL**, **Redis**, and **Stripe** payment integration. This project follows clean architecture principles and implements modern async/await patterns throughout.

## Features

- **Authentication Service** - JWT-based user registration, login, and token refresh
- **Product Service** - Full CRUD operations for products and categories with filtering and search
- **Cart Service** - Redis-powered shopping cart with real-time inventory checks
- **Order Service** - Complete order management with automatic stock updates
- **Payment Service** - Stripe payment integration with webhook support
- **Admin Panel** - Protected admin routes for product and category management

## Tech Stack

- **Backend Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL with SQLAlchemy (async)
- **Cache:** Redis (for cart and sessions)
- **Message Queue:** Celery with Redis broker
- **Authentication:** JWT with PyJWT
- **Payments:** Stripe API
- **Testing:** Pytest with async support
- **Containerization:** Docker & Docker Compose
- **Migrations:** Alembic
- **Docs:** Auto-generated Swagger UI at `/docs`

## Project Structure

```
ecommerce-backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── products.py     # Product endpoints
│   │       ├── cart.py         # Cart endpoints
│   │       ├── orders.py       # Order endpoints
│   │       └── payments.py     # Payment endpoints
│   ├── core/
│   │   ├── config.py           # Settings and configuration
│   │   ├── security.py         # JWT and password hashing
│   │   ├── utils.py            # Utility functions
│   │   └── dependencies.py     # FastAPI dependencies
│   ├── db/
│   │   ├── base.py             # Database base
│   │   ├── session.py          # Database session
│   │   └── models/
│   │       ├── user.py
│   │       ├── product.py
│   │       └── order.py
│   ├── schemas/                # Pydantic models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── cart.py
│   │   └── order.py
│   ├── services/
│   │   ├── payment_service.py
│   │   └── email_service.py
│   └── tests/
│       ├── conftest.py
│       ├── test_auth.py
│       └── test_products.py
├── alembic/                    # Database migrations
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md
```

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- PostgreSQL 15+ (if not using Docker)
- Redis 7+ (if not using Docker)

### Using Docker Compose (Recommended)

1. **Clone the repository**

```bash
git clone <repository-url>
cd ecommerce-backend
```

2. **Create environment file**

```bash
cp .env.example .env
```

Edit `.env` with your configuration (optional for local development).

3. **Start all services**

```bash
docker-compose up --build
```

This will start:
- **API** at http://localhost:8000
- **PostgreSQL** at localhost:5432
- **Redis** at localhost:6379
- **Adminer** (DB viewer) at http://localhost:8080

4. **Run database migrations**

```bash
docker-compose exec api alembic upgrade head
```

5. **Access the API documentation**

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Local Development (Without Docker)

1. **Install dependencies**

```bash
pip install -r requirements.txt
```

2. **Set up PostgreSQL and Redis**

Ensure PostgreSQL and Redis are running locally.

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/ecommerce
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=your-secret-key
STRIPE_API_KEY=sk_test_your_key
```

4. **Run migrations**

```bash
alembic upgrade head
```

5. **Start the API**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check

```
GET /health
GET /api/v1/auth/health
GET /api/v1/products/health
GET /api/v1/cart/health
GET /api/v1/orders/health
GET /api/v1/payments/health
```

### Authentication

```
POST   /api/v1/auth/register      # Register new user
POST   /api/v1/auth/login         # Login and get tokens
POST   /api/v1/auth/refresh       # Refresh access token
GET    /api/v1/auth/me            # Get current user info
```

### Products

```
GET    /api/v1/products                    # List products (with filters)
GET    /api/v1/products/{id}               # Get product by ID
POST   /api/v1/products                    # Create product (admin)
PUT    /api/v1/products/{id}               # Update product (admin)
DELETE /api/v1/products/{id}               # Delete product (admin)
GET    /api/v1/products/categories/list    # List categories
POST   /api/v1/products/categories         # Create category (admin)
```

**Query Parameters for List Products:**
- `skip`: Pagination offset (default: 0)
- `limit`: Results per page (default: 100, max: 100)
- `category_id`: Filter by category
- `min_price`: Minimum price filter
- `max_price`: Maximum price filter
- `search`: Search in name and description

### Cart

```
GET    /api/v1/cart              # Get current cart
POST   /api/v1/cart/items        # Add item to cart
PUT    /api/v1/cart/items/{id}   # Update cart item quantity
DELETE /api/v1/cart/items/{id}   # Remove item from cart
DELETE /api/v1/cart              # Clear entire cart
```

### Orders

```
POST   /api/v1/orders            # Create order from cart
GET    /api/v1/orders            # List user orders
GET    /api/v1/orders/{id}       # Get order details
```

### Payments

```
POST   /api/v1/payments/create-intent    # Create Stripe payment intent
POST   /api/v1/payments/webhook          # Stripe webhook handler
```

## Authentication

The API uses JWT Bearer tokens for authentication.

1. **Register a user:**

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "full_name": "John Doe"
  }'
```

2. **Login to get tokens:**

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

3. **Use the access token in subsequent requests:**

```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Testing

Run the test suite:

```bash
# Using Docker
docker-compose exec api pytest

# Locally
pytest
```

Run with coverage:

```bash
pytest --cov=app --cov-report=html
```

## Database Migrations

### Create a new migration

```bash
alembic revision --autogenerate -m "description"
```

### Apply migrations

```bash
alembic upgrade head
```

### Rollback migrations

```bash
alembic downgrade -1
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://postgres:example@localhost:5432/ecommerce` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `JWT_SECRET` | Secret key for JWT signing | `supersecretkey_change_in_production` |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiration | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token expiration | `7` |
| `STRIPE_API_KEY` | Stripe API key | `sk_test_dummy` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | - |
| `CELERY_BROKER_URL` | Celery broker URL | `redis://localhost:6379/1` |
| `CELERY_RESULT_BACKEND` | Celery result backend | `redis://localhost:6379/2` |

## Production Deployment

### Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use real Stripe API keys (not test keys)
- [ ] Set `STRIPE_WEBHOOK_SECRET` for webhook validation
- [ ] Enable HTTPS/TLS
- [ ] Set up proper CORS origins (not `*`)
- [ ] Use environment-specific databases
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backups for PostgreSQL
- [ ] Use Redis persistence (AOF/RDB)

### Recommended Infrastructure

- **API:** Multiple instances behind a load balancer
- **Database:** PostgreSQL with read replicas
- **Cache:** Redis cluster or sentinel setup
- **Queue:** Celery workers for background tasks
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK stack or similar

## Troubleshooting

### Database connection errors

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres
```

### Redis connection errors

```bash
# Check if Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Migration errors

```bash
# Reset database (WARNING: destroys all data)
docker-compose down -v
docker-compose up -d postgres
docker-compose exec api alembic upgrade head
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
