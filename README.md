# MedApp

E-health platform for doctors and patients: questionnaires, health monitoring, and answer tracking.

## Prerequisites

- **Java 21**
- **Node.js** (v18+)
- **PostgreSQL** (running locally or via Docker)

## Quick Start

### 1. Database

Create a PostgreSQL database and user:

```sql
CREATE DATABASE medapp;
CREATE USER medapp WITH PASSWORD 'medapp';
GRANT ALL PRIVILEGES ON DATABASE medapp TO medapp;
```

Or use env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (defaults: localhost, 5432, medapp, medapp, medapp).

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Runs on **http://localhost:8080**. On startup, seed data is loaded (see below).

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Runs on **http://localhost:4200**.

## Using the App

### Login

| Role   | Email              | Password |
|--------|--------------------|----------|
| Doctor | yorgoDR@hotmail.com | Test123! |
| Patient| jennifer@hotmail.com | Test123! |
| Patient| nancy@hotmail.com   | Test123! |

### Doctor

- **Dashboard** – Overview
- **Patients** – List of patients
- **Patient answers** – View a patient’s questionnaire answers
- **Create questionnaire** – Create and assign questionnaires
- **Monitoring** – Monitoring dashboard

### Patient

- **Dashboard** – Overview
- **Questionnaire** – Fill assigned questionnaires
- **History** – View past submissions

## Tech Stack

- **Backend**: Spring Boot 3.2, Java 21, PostgreSQL, JPA
- **Frontend**: Angular 18
