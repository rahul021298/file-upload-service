# File Upload Service - NestJS Application

## Overview

This project is a NestJS-based file upload service that uses PostgreSQL as the database. It includes JWT authentication and Redis caching. This guide explains how to set up and run the application locally and with Docker.

---

## Prerequisites

- Node.js (v18+)
- npm
- PostgreSQL (local or remote)
- Redis (local or remote)
- Docker & Docker Compose (optional)

---

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repo-url>
cd file-upload-service
npm install
```

### 2. Create PostgreSQL Database

Make sure PostgreSQL is running. Then create DB:

```bash
psql -U postgres
CREATE DATABASE my_app_db;
\q
```

### 3. Configure Environment Variables

Create a .env file in your project root

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Build and Start App Locally

```bash
npm run build
npm run start
```

---

## Docker Setup (Optional)

### 1. Build Docker Image

```bash
docker-compose build
```

### 2. Start Containers

```bash
docker-compose up
```

---

## Notes

- Ensure Redis and Postgres are accessible from app (localhost or Docker network).
- Migrations must run before starting app.
- Adjust `.env` values as needed.

---

## Useful Scripts

- `npm run build` — Build TypeScript
- `npm run start` — Run app
- `npm run migration:run` — Run DB migrations

---
