.PHONY: dev-fe dev-be dev install-fe install-be setup

## Setup everything from scratch
setup: install-be install-fe
	@echo "✅ EcoSentinel setup complete!"
	@echo "📋 Next steps:"
	@echo "   1. Copy backend/.env.example → backend/.env and fill in values"
	@echo "   2. Copy frontend/.env.example → frontend/.env.local and fill in values"
	@echo "   3. Run 'make dev' to start development servers"

install-be:
	@echo "📦 Installing Python dependencies..."
	cd backend && pip install -e ".[dev]"

install-fe:
	@echo "📦 Installing Node.js dependencies..."
	cd frontend && npm install

## Start frontend dev server
dev-fe:
	cd frontend && npm run dev

## Start backend dev server
dev-be:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Run backend tests
test-be:
	cd backend && pytest tests/ -v --cov=app

## Run frontend type check
typecheck-fe:
	cd frontend && npx tsc --noEmit

## Run with Docker Compose
docker-up:
	docker-compose up --build

docker-down:
	docker-compose down -v

## Format Python code
format-be:
	cd backend && ruff check . --fix && black .

## Lint check
lint:
	cd backend && ruff check .
	cd frontend && npx eslint src/
