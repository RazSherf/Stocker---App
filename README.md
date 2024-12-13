Smart Retail Inventory System

Overview

The Smart Retail Inventory System is an advanced inventory management solution tailored for retail store chains. It provides real-time stock level tracking, low-stock notifications, and restocking capabilities, helping store managers optimize inventory processes.

Features

Inventory Management

View Products:

GET /api/products: Retrieve a list of all products with stock levels.

GET /api/products/<product_id>: View details of a specific product.

Manage Products:

POST /api/products: Add a new product with details such as name, SKU, and initial stock level.

PUT /api/products/<product_id>: Update product details or stock levels.

DELETE /api/products/<product_id>: Remove a product from the inventory.

Restocking Operations

Restock Products:

POST /api/products/<product_id>/restock: Add stock to a product with a specified quantity.

View Restocking Logs:

GET /api/restocks: Fetch a history of all restocking activities.

Analytics

Low Stock Alerts:

GET /api/products/low-stock: Fetch products with stock below a predefined threshold.

Stock Trends:

GET /api/products/analytics: View stock analytics and trends for data-driven decisions.

Tech Stack

Application Development

Backend: Python Flask (REST API for CRUD operations and analytics).

Database: MongoDB (to store products, stock levels, and restocking logs).

Containerization

Docker:

Separate Dockerfiles for Flask backend.

Use docker-compose for linking services in local development.

Deployment

AWS:

Host the application using AWS services.

Kubernetes:

ConfigMaps for application-specific settings.

Secrets for MongoDB credentials.

Deployments and Services for managing Flask backend and MongoDB.

Ingress for external access to the app.

Monitoring

Prometheus:

Monitor API response times and container resource usage.

Grafana:

Dashboards for stock trends and API latency.

CI/CD

Pipeline Stages:

Lint Flask code.

Run unit tests for backend logic.

Build and push Docker images to Docker Hub.

Deploy to Kubernetes using manifests.

Perform live API testing.

API Endpoints

Inventory Management

GET /api/products: List all products.

GET /api/products/<product_id>: View details of a specific product.

POST /api/products: Add a new product (JSON payload required).

PUT /api/products/<product_id>: Update product details.

DELETE /api/products/<product_id>: Remove a product.

Restocking Operations

POST /api/products/<product_id>/restock: Add stock to a product (quantity in JSON payload).

GET /api/restocks: View the restocking history.

Analytics

GET /api/products/low-stock: Fetch products below the stock threshold.

GET /api/products/analytics: Retrieve stock trend data.

Local Development

Prerequisites

Python 3.8+

Docker

MongoDB instance

AWS CLI (for deployment)

Steps

Clone the repository:

git clone https://github.com/your-username/smart-retail-inventory.git
cd smart-retail-inventory

Set up a virtual environment and install dependencies:

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

Run the Flask server:

flask run

(Optional) Start MongoDB locally or connect to an existing instance.

Using Docker

Build and run the backend service:

docker build -t inventory-backend .
docker run -p 5000:5000 inventory-backend

Use docker-compose for linked services:

docker-compose up

Deployment

Kubernetes (Optional)

Apply Kubernetes manifests:

kubectl apply -f k8s/

Access the application via the configured Ingress.

AWS

Use an EC2 instance with Docker to host the app.

Connect the MongoDB database via AWS-hosted MongoDB service or self-hosted.

Monitoring and Analytics

Prometheus: Tracks API performance and resource usage.

Grafana: Provides visual dashboards for actionable insights.

Repository Structure

app/: Contains Flask backend code.

docker/: Dockerfiles for containerization.

k8s/: Kubernetes manifests for deployment.

ci-cd/: Jenkins pipeline configurations.

docs/: Documentation and guides.
