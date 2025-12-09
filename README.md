# Microservices E‑Commerce Project  
Running on **GitHub Codespaces** with **Docker Compose**, **Spring Boot**, **Eureka**, and **Microfrontends**.

---

## 🚀 Project Overview
This project demonstrates a complete microservices architecture including:

- **Product Service**  
- **Order Service**  
- **Discovery Service (Eureka)**  
- **API Gateway (Spring Cloud Gateway)**  
- **Frontend (Shell App + Products Microfrontend)**  
- **Prometheus + Grafana for monitoring**

Everything runs in **GitHub Codespaces**, automatically resolving internal service URLs.

---

## 📦 Prerequisites
Your Codespace already includes everything, but if running locally:

- Docker & Docker Compose
- Node 18+
- Java 17+
- Maven 3.x

---

## ▶️ How to Run the Project (Codespaces)

### **1️⃣ Start all backend services**
```sh
docker-compose up --build
```

Services started:

| Service | URL |
|--------|------|
| API Gateway | http://localhost:8080 |
| Eureka Discovery | http://localhost:8761 |
| Product Service | via Gateway |
| Order Service | via Gateway |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |

---

### **2️⃣ Install frontend dependencies**
From the project root:

```sh
cd shell-app
npm install

cd ../products-mf
npm install
```

---

### **3️⃣ Run the frontends**
#### Shell App:
```sh
cd shell-app
npm run dev
```

#### Products Microfrontend:
```sh
cd products-mf
npm run dev
```

---

## 🌐 Access the Application

| Component | URL |
|----------|-----|
| **Main Frontend (Shell)** | http://localhost:5173 |
| **Products MF** | http://localhost:4173 |
| **Backend Gateway** | http://localhost:8080 |
| **Eureka Dashboard** | http://localhost:8761 |
| **Grafana Dashboard** | http://localhost:3000 |

---

## 🛠 Notes for Running in Codespaces

Codespaces exposes public URLs automatically.

We use:

```yml
eureka.client.serviceUrl.defaultZone: ${EUREKA_URI}
```

You do **not** hardcode the gateway or discovery URL anywhere.

---

## ✔️ End Goal
After following these steps, you can:

- View frontend microfrontends working with backend services  
- See service discovery via Eureka  
- Access API Gateway routes  
- Monitor with Prometheus & Grafana  

---
