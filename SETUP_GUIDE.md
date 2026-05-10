# Setup Guide

## Requirements
- Node.js 20+
- MySQL 8.0 (Local Installation)

## Quick Start

### 1. Database Setup
1. Ensure your local MySQL server is running.
2. The default configuration expects a `root` user with **no password**.
3. Run the following command to import the database schema and seed data:
```bash
mysql -u root -e "DROP DATABASE IF EXISTS sfms_db; CREATE DATABASE sfms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root sfms_db < database/schema.sql
mysql -u root sfms_db < database/triggers.sql
mysql -u root sfms_db < database/procedures.sql
mysql -u root sfms_db < database/seed.sql
```

### 2. Backend Setup
```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env and ensure DB credentials match your setup if different from default
npm run dev
```
Backend will run at `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`

## Demo Credentials
- **Super Admin**: `admin` / `password123`
- **Accountant**: `accountant1` / `password123`
- **Student**: `student1` / `password123`
