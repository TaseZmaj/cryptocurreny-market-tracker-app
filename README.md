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
