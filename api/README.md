# CebStore E-Commerce API

Modern AI-powered e-commerce REST API built with NestJS, PostgreSQL, Prisma, and Redis.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens, role-based access control
- **Product Management**: Full CRUD operations with categories, stock tracking, and search
- **Shopping Cart**: Real-time cart management with stock validation
- **Order Processing**: Complete order lifecycle with status tracking
- **Payment Integration**: Flouci payment gateway with webhooks
- **AI Features**: 
  - Intelligent chatbot with RAG (Retrieval-Augmented Generation)
  - Product recommendations based on user behavior
  - Semantic search with vector embeddings
  - Sentiment analysis for reviews
- **Caching**: Redis-based caching for improved performance
- **Rate Limiting**: Configurable rate limiting to prevent abuse
- **Health Checks**: Comprehensive health monitoring endpoints
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

## 📁 Project Structure

```
api/
├── src/
│   ├── common/              # Shared utilities, guards, decorators, filters
│   │   ├── decorators/      # Custom decorators (@Public, @Roles, @GetUser)
│   │   ├── dto/             # Common DTOs (pagination, responses)
│   │   ├── filters/         # Exception filters
│   │   ├── guards/          # Auth guards (JWT, Roles)
│   │   ├── interceptors/    # Request/response interceptors
│   │   ├── middleware/      # Custom middleware (request-id)
│   │   ├── pipes/           # Validation pipes
│   │   └── repositories/    # Base repository pattern
│   ├── config/              # Configuration modules
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication & authorization
│   │   ├── users/           # User management
│   │   ├── products/        # Product catalog
│   │   ├── categories/      # Category management
│   │   ├── carts/           # Shopping cart
│   │   ├── orders/          # Order processing
│   │   ├── payments/        # Payment integration
│   │   ├── reviews/         # Product reviews
│   │   ├── discounts/       # Discount codes
│   │   ├── ai/              # AI features (chatbot, recommendations)
│   │   ├── analytics/       # Analytics & reporting
│   │   ├── admin/           # Admin dashboard APIs
│   │   ├── cache/           # Redis caching
│   │   ├── health/          # Health check endpoints
│   │   └── ...
│   ├── prisma/              # Prisma ORM service
│   ├── utils/               # Utility functions
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Root controller
│   ├── app.service.ts       # Root service
│   └── main.ts              # Application entry point
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── test/                    # E2E tests
├── .env.example             # Environment variables template
├── package.json
└── tsconfig.json
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | NestJS 11 |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL 15+ |
| **ORM** | Prisma 5 |
| **Cache** | Redis |
| **Authentication** | JWT (passport-jwt) |
| **Validation** | class-validator, class-transformer |
| **Documentation** | Swagger/OpenAPI |
| **AI** | OpenAI API |
| **Payment** | Flouci |
| **Testing** | Jest, Supertest |

## 📦 Installation

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis (optional, for caching)
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Development) Run migrations and seed database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run start:dev
```

## 🔧 Configuration

See `.env.example` for all available configuration options.

### Key Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cebstore

# JWT Secrets (generate strong random strings!)
JWT_SECRET=your-secret-minimum-32-characters
REFRESH_SECRET=your-refresh-secret-minimum-32-characters

# Redis (optional)
REDIS_URL=redis://localhost:6379

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...

# Payment (Flouci)
FLOUCI_APP_PUBLIC=your-public-key
FLOUCI_APP_SECRET=your-secret-key
FLOUCI_SANDBOX=true
```

## 📚 API Documentation

Once the server is running, access the interactive API documentation at:

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs-json

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/logout` | Logout (requires auth) |
| POST | `/api/v1/auth/refresh` | Refresh token (requires refresh token) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products` | List products (paginated) |
| GET | `/api/v1/products/:id` | Get product by ID |
| POST | `/api/v1/products` | Create product (admin) |
| PUT | `/api/v1/products/:id` | Update product (admin) |
| DELETE | `/api/v1/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/orders` | List user orders |
| GET | `/api/v1/orders/:id` | Get order details |
| POST | `/api/v1/orders` | Create order |
| PUT | `/api/v1/orders/:id` | Update order |
| POST | `/api/v1/orders/:id/cancel` | Cancel order |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Admin dashboard data |
| GET | `/api/v1/admin/users` | List all users |
| GET | `/api/v1/admin/products` | List all products |
| GET | `/api/v1/admin/orders` | List all orders |
| POST | `/api/v1/admin/users/:id/ban` | Ban user |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Basic health check |
| GET | `/api/v1/health/detailed` | Detailed health status |
| GET | `/api/v1/health/ready` | Kubernetes readiness probe |
| GET | `/api/v1/health/live` | Kubernetes liveness probe |

## 🧪 Testing

```bash
# Unit tests
npm run test

# Test with coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 📈 Performance Optimization

The API includes several performance optimizations:

1. **Redis Caching**: Frequently accessed data (products, categories) is cached
2. **Database Indexing**: Strategic indexes on frequently queried columns
3. **Query Optimization**: Efficient Prisma queries with proper includes
4. **Rate Limiting**: Prevents abuse and ensures fair usage
5. **Connection Pooling**: Optimized database connection management

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **Rate Limiting**: Configurable request throttling
- **Helmet Headers**: Security HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive DTO validation
- **SQL Injection Protection**: Prisma ORM parameterized queries

## 🤖 AI Features

### Chatbot
- Contextual conversations using RAG
- Product recommendations during chat
- Sentiment-aware responses

### Recommendations
- Personalized product suggestions
- Based on purchase history and browsing behavior
- Semantic similarity matching

### Semantic Search
- Vector-based product search
- Natural language queries
- Relevance scoring

## 📝 Development Guidelines

### Code Style
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Commit Convention
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 🚀 Deployment

### Production Build

```bash
# Build
npm run build

# Run production server
npm run start:prod
```

### Docker (Optional)

```bash
# Build image
docker build -t cebstore-api .

# Run container
docker run -p 3001:3001 --env-file .env cebstore-api
```

## 📄 License

MIT License - see LICENSE file for details.

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Contact: support@cebstore.com
