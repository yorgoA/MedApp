#!/bin/bash
# Run MedApp locally
# 1. Start PostgreSQL: docker compose -f docker-compose.dev.yml up -d
# 2. Backend: cd backend && mvn spring-boot:run
# 3. Frontend: cd frontend && npm start

echo "MedApp - E-Health Platform"
echo ""
echo "Start services in separate terminals:"
echo "  1. docker compose -f docker-compose.dev.yml up -d     # PostgreSQL"
echo "  2. cd backend && ./mvnw spring-boot:run                # Backend (port 8080)"
echo "  3. cd frontend && npm start                             # Frontend (port 4200)"
echo ""
echo "Then open http://localhost:4200"
echo "Demo: doctor@medapp.com / doctor123  or  patient@medapp.com / patient123"
