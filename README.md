# Fullstack Cryptocurrency Market Tracker Application

A professional-grade distributed system designed to monitor cryptocurrency markets, perform automated technical analysis, and provide price trend predictions using Deep Learning (LSTM).

---

## 🏗 System Architecture

The application is built using a **Microservices Architecture**, with each component isolated in its own Docker container:

- **Frontend**: React (Vite) + Material UI, served via **Nginx** as a reverse proxy.
- **Backend**: **Java Spring Boot** (REST API) managing data orchestration.
- **Database**: **MongoDB** for historical price data and symbol storage.
- **LSTM Predictor AI Microservice**: **Python (FastAPI)** running **LSTM Neural Networks** for price prediction.
- **Technical Analysis Microservice**: **Python (FastAPI)** for calculating Technical Indicators (RSI, MA, etc.).

---

## 🚦 How to Run Gracefully

Follow these steps to deploy the entire stack on your local machine.

### 1. Prerequisites

- **Docker Desktop** installed and running.
- Ensure the following ports are free: `3000`, `8080`, `8081`, `8082`, `27017`.

### 2. Environment Configuration

The local Compose setup includes its own MongoDB container. No cloud database credentials are needed.

To override the default local connection, copy `.env.example` to `.env` and edit `MONGODB_URI`. The default value is:

```text
mongodb://mongodb:27017/crypto_db
```

The frontend uses **Build-Time Arguments** to configure the API endpoints in its static JavaScript bundle. These are pre-configured in the Compose files.

### 3. One-Command Deployment

Open your terminal in the project root and run:

```powershell
docker-compose -f docker-compose.yml up -d --build
```

The backend waits for MongoDB to become healthy and then runs the existing data pipeline. MongoDB data is stored in the `mongodb-data` named volume.

To remove the local database and start from an empty database:

```powershell
docker-compose -f docker-compose.yml down -v
```

### Bonus

For development, run this:

```powershell
docker-compose -f docker-compose-dev.yml watch
```

This enables hot reload and React dev tools while working on the frontend
