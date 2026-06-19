# ⚙️ EcoSentinel Backend API

A high-performance, production-ready FastAPI backend designed with Clean Architecture principles. It handles database storage (PostgreSQL), session caching (Redis), rate-limiting, user authorization, and integrates directly with Google Gemini AI to generate insights.

---

## 🛠️ Tech Stack & Dependencies

*   **API Framework**: FastAPI & Uvicorn
*   **Database Engine**: PostgreSQL with SQLAlchemy 2.0 ORM & Alembic migrations
*   **Cache & Rate Limiting**: Redis & SlowAPI
*   **Security & Identity**: Firebase Admin JWT validation
*   **AI Engine**: `google-generativeai` client
*   **Logging & Tracing**: Structlog & Sentry SDK
*   **Testing**: PyTest with coverage tracking

---

## 📁 Architecture Overview

Following Clean Architecture principles, the directory structure decouples logic from external delivery layers:

```
backend/
├── app/
│   ├── api/                    # API endpoints & HTTP Layer
│   │   ├── middleware/         # Auth verification, rate limiting, logging middlewares
│   │   └── v1/                 # Versioned API routes (emissions, analytics, AI, etc.)
│   ├── application/            # Application logic, Use Cases, & Pydantic validation schemas
│   ├── domain/                 # Core entity models, repositories, and domain services
│   ├── infrastructure/         # External systems (PostgreSQL setup, Redis caching, Firebase API, Gemini client)
│   ├── config.py               # Application configurations (Pydantic Settings)
│   └── main.py                 # ASGI entry point
├── tests/                      # Pytest unit & integration test suites
└── pyproject.toml              # Project dependencies and configurations
```

---

## 🚀 Running the API

Ensure you have your virtual environment activated and dependencies installed (e.g. `pip install -e ".[dev]"`).

```bash
# Start backend server locally with auto-reload (port 8000)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run all test suites
pytest

# Run tests with test coverage calculation
pytest --cov=app tests/
```

Once running, interactive API docs are available at:
*   **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## ⚙️ Environment Configuration (`.env`)

Create a `.env` file inside the `backend/` directory referencing `.env.example`:

```ini
# Application Setup
APP_NAME="EcoSentinel API"
ENVIRONMENT="development"
DEBUG=true

# Database Connections
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecosentinel"
REDIS_URL="redis://localhost:6379/0"

# Firebase Admin configuration JSON string
FIREBASE_CREDENTIALS='{ ... }'

# AI Model Keys
GEMINI_API_KEY="your-gemini-api-key"
```
