import asyncio
import pytest
from typing import AsyncGenerator, Generator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI

# Set up test environment variables before importing app components
import os
os.environ["ENVIRONMENT"] = "testing"
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["FIREBASE_PROJECT_ID"] = "test-project-123"
os.environ["FIREBASE_SERVICE_ACCOUNT_KEY"] = '{"type": "service_account"}'
os.environ["GEMINI_API_KEY"] = "mock-api-key"
os.environ["REDIS_URL"] = "redis://localhost:6379"

from app.main import app
from app.infrastructure.database.base import Base, get_db
from app.infrastructure.database.models.user_model import UserModel
from app.domain.entities.user import UserRole
from app.api.middleware.firebase_auth import require_any, require_analyst

# Use sqlite in-memory for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Mock user for authentication override
MOCK_USER = UserModel(
    firebase_uid="test_firebase_uid_123",
    email="testuser@example.com",
    display_name="Test User",
    photo_url="https://example.com/photo.jpg",
    role=UserRole.ADMIN,  # Give admin privilege to bypass require_analyst
    is_active=True,
)

async def override_require_any():
    return MOCK_USER

async def override_require_analyst():
    return MOCK_USER

async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Apply dependency overrides
app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[require_any] = override_require_any
app.dependency_overrides[require_analyst] = override_require_analyst

@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="function", autouse=True)
async def setup_database():
    """Create schema and tables before each test and drop them after."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Return an async HTTP client for app routes."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac
