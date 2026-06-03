# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Heart — 心脏解剖与血液循环互动教学平台。帮助学生直观学习心脏各部位功能及血液/氧气循环过程。前后端分离架构，未来可能扩展更多教学模块。

## Commands

### Frontend (React + TypeScript + Vite)

```bash
cd frontend
npm run dev          # Dev server at http://localhost:5173
npm run build        # Production build (tsc + vite)
npm run lint         # ESLint check
npm run test         # Run tests (add vitest first)
npm run test -- --run src/hooks/__tests__/useHeartbeat.test.ts  # Single test file
```

### Backend (Spring Boot + Java 17 + Maven)

```bash
cd backend
mvn spring-boot:run                             # Dev server at http://localhost:8080
mvn test                                        # All tests
mvn test -Dtest=HeartApplicationTests           # Single test class
mvn test -Dtest="HeartApplicationTests#contextLoads"  # Single test method
mvn clean package -DskipTests                   # Build JAR without tests
mvn spring-boot:run -Dspring-boot.run.profiles=prod  # Run with prod profile
```

## Architecture

```
heart/
├── frontend/                # React 19 + TypeScript 6 + Vite 8
│   └── src/
│       ├── components/      # UI components (organized by feature)
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Utilities, API client, constants
│       └── pages/           # Page-level components
├── backend/                 # Spring Boot 3.3 + Java 17
│   └── src/main/java/com/heart/
│       ├── controller/      # REST endpoints (api/**)
│       ├── service/         # Business logic
│       ├── model/           # JPA entities + DTOs
│       ├── repository/      # Spring Data JPA interfaces
│       └── config/          # Spring configuration (CORS, security, etc.)
└── skills-lock.json         # Skill registry (do not edit manually)
```

### Key Conventions

- **Frontend API calls** go through `src/lib/api.ts` — centralize fetch logic, don't scatter raw `fetch()` calls
- **Backend API prefix**: all REST endpoints use `/api/**` path
- **CORS**: backend allows `http://localhost:5173` in dev (configured in `CorsConfig.java`)
- **Database**: H2 in-memory for dev (`jdbc:h2:mem:heartdb`), PostgreSQL for prod (via `DATABASE_URL` env var)
- **H2 Console**: available at `http://localhost:8080/h2-console` in dev

### Data Flow

Frontend → `/api/**` → Controller → Service → Repository → Database

- Controllers handle HTTP and delegate to services
- Services contain business logic and orchestration
- Repositories are Spring Data JPA interfaces (no implementation classes needed)
- Models split into entities (JPA `@Entity`) and DTOs (request/response objects)

## Tech Details

- **Frontend**: React 19, TypeScript 6, Vite 8, ESLint 10
- **Backend**: Spring Boot 3.3, Java 17, Spring Data JPA, Lombok, H2/PostgreSQL
- **API format**: `{ success: boolean, data?: T, error?: string, meta?: { total, page, limit } }`
