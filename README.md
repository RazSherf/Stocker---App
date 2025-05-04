# Smart Retail Inventory System

> **Real‑time inventory management and analytics for modern retail chains**

---

## Features

* **Inventory Management** – CRUD endpoints to manage products and stock levels.
* **Restocking Operations** – Track and log restock events with audit history.
* **Low‑Stock Alerts** – Identify products below threshold for timely replenishment.
* **Analytics & Trends** – Visualize stock movement to support data‑driven decisions.
* **Containerized** – Docker‑first workflow with `docker‑compose` for local dev.
* **Cloud‑Ready** – Kubernetes manifests and AWS deployment guidance included.
  
---

## Tech Stack

| Layer                | Technology                     |
| -------------------- | ------------------------------ |
| **API**              | Python 3.8 • Flask RESTX       |
| **Database**         | MongoDB (Atlas or self‑hosted) |
| **Containerization** | Docker • Docker Compose        |
| **Orchestration**    | Kubernetes (helm‑ready)        |
| **Cloud**            | AWS (EKS / EC2 + Docker)       |
| **Observability**    | Prometheus • Grafana           |
| **CI/CD**            | GitHub Actions /Jenkins        |

---

## Quick Start

```bash
# Clone
$ git clone https://github.com/<your-org>/smart-retail-inventory.git
$ cd smart-retail-inventory

# Local Python env
$ python3 -m venv venv && source venv/bin/activate
$ pip install -r requirements.txt

# Run API
$ flask run --debug  # http://localhost:5000
```

### With Docker

```bash
# Build & Run
$ docker build -t inventory-backend .
$ docker run -p 5000:5000 inventory-backend

# Or spin up API + MongoDB
$ docker-compose up
```

---

## API Reference

<details>
<summary>Inventory Management</summary>

| Verb   | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/products`      | List all products |
| GET    | `/api/products/<id>` | Product details   |
| POST   | `/api/products`      | Add new product   |
| PUT    | `/api/products/<id>` | Update product    |
| DELETE | `/api/products/<id>` | Delete product    |

</details>

<details>
<summary>Restocking</summary>

| Verb | Endpoint                     | Description        |
| ---- | ---------------------------- | ------------------ |
| POST | `/api/products/<id>/restock` | Add stock quantity |
| GET  | `/api/restocks`              | Restock history    |

</details>

<details>
<summary>Analytics</summary>

| Verb | Endpoint                  | Description      |
| ---- | ------------------------- | ---------------- |
| GET  | `/api/products/low-stock` | Low‑stock list   |
| GET  | `/api/products/analytics` | Stock trend data |

</details>

> **Note:** Authentication & rate‑limiting can be enabled via middleware (see `app/extensions/`).

---

## Deployment

### Kubernetes

```bash
# Apply manifests
$ kubectl apply -f k8s/

# Verify
$ kubectl get all -l app=smart-retail-inventory
```

Includes Deployments, Services, ConfigMaps, Secrets and an Ingress for external access.

### AWS (EC2 demo)

1. Provision an EC2 instance with Docker installed.
2. Pull the latest image:

   ```bash
   docker pull <dockerhub-username>/inventory-backend:latest
   ```
3. Run container with MongoDB connection env vars.
4. Point your ALB / NLB to the instance or migrate to EKS for production.

See [`docs/deployment.md`](docs/deployment.md) for step‑by‑step guides.

---

## Monitoring & Observability

| Metric          | Source              | Grafana Panel         |
| --------------- | ------------------- | --------------------- |
| API latency     | Prometheus Exporter | *API Latency (ms)*    |
| CPU / Memory    | cAdvisor            | *Container Resources* |
| Low‑stock count | Custom Collector    | *Inventory Health*    |

Dashboards are provisioned automatically via Grafana config in `k8s/grafana/`.

---

## Repository Structure

```
smart-retail-inventory/
├── app/               # Flask application code
├── docker/            # Dockerfiles & compose
├── k8s/               # Kubernetes manifests
├── ci-cd/             # Pipeline configs (GitHub Actions / Jenkins)
├── docs/              # Additional documentation
└── README.md
```
