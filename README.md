# Stocker
Simplifying inventory management with smart, automated solutions for retailers



Overview

The Smart Retail Inventory System is a comprehensive inventory management solution designed to help retail store chains manage their stock levels in real-time, automate restocking processes, and provide insightful analytics. The system includes a REST API built with Flask for backend operations, an optional React frontend for visualization, and a PostgreSQL database for data persistence. Additionally, the project is containerized using Docker and deployed using Kubernetes for scalability and efficient management.

Key Features

	•	Inventory Management: Track products and stock levels, update stock, and place restocking orders through an API.
	•	Restocking Notifications: Get notified when stock levels are low and automatically initiate restocking operations.
	•	Stock Analytics: Generate and view analytics on stock trends, which can be visualized through the frontend dashboard.
	•	Containerization & Orchestration: The entire system is containerized using Docker and orchestrated with Kubernetes, allowing for easy deployment and scaling.
	•	Monitoring: Prometheus is integrated for monitoring the API and resource usage, with Grafana dashboards to visualize system performance and stock trends.

Tech Stack

	•	Backend: Flask – A Python-based framework for building the RESTful API that handles inventory management, restocking, and analytics.
	•	Frontend (Optional): React – A JavaScript library for building the dashboard, which includes graphs and charts (using Chart.js) to visualize stock levels and trends.
	•	Database: PostgreSQL – A relational database used to store product data, stock levels, and restocking logs.
	•	Containerization: Docker – The backend (Flask API) and frontend (React) are containerized using Docker, enabling a consistent environment across development and production.
	•	Orchestration: Kubernetes – Used for deploying and managing the application in a scalable manner, with separate deployments for Flask, React, and PostgreSQL.
	•	Monitoring: Prometheus & Grafana – Used for monitoring API performance and resource usage, with Grafana used to create dashboards for stock trends and API latency.
	•	CI/CD: Jenkins – Automated build and deployment pipeline with health checks, unit tests, and Docker image creation.

How the Project is Implemented

Backend (Flask API)

The Flask app provides several endpoints for interacting with the inventory system:
	•	Products Management:
	•	GET /api/products: Retrieve a list of all products with their current stock levels.
	•	GET /api/products/<product_id>: Retrieve details for a specific product.
	•	POST /api/products: Add a new product to the inventory.
	•	PUT /api/products/<product_id>: Update product details or stock levels.
	•	DELETE /api/products/<product_id>: Delete a product from the inventory.
	•	Restocking Operations:
	•	POST /api/products/<product_id>/restock: Restock a product when its stock is low.
	•	GET /api/restocks: View a log of restocking activities.
	•	Stock Analytics:
	•	GET /api/products/low-stock: Get a list of products that are low on stock.
	•	GET /api/products/analytics: Fetch data on stock trends to be visualized on the frontend dashboard.

Frontend 

The React frontend allows store managers to:
	•	View and manage stock levels.
	•	See visual analytics on stock trends with the help of Chart.js.
	•	Interact with the backend API to update stock and manage products through a user-friendly interface.

Database (PostgreSQL)

The database uses PostgreSQL to store essential data:
	•	Products Table: Stores product information such as name, SKU, and stock level.
	•	Stock Levels Table: Tracks the current available stock for each product.
	•	Restocking Logs Table: Keeps a record of when products were restocked and the quantities added.

Containerization with Docker

The application is containerized using Docker for both the backend (Flask) and frontend (React), ensuring a consistent and portable environment for development and production.
	•	Backend Dockerfile: Contains instructions to build the Flask app container.
	•	Frontend Dockerfile: Defines the build process for the React frontend container.

Docker Compose is used for local development to spin up the entire system (Flask API, React frontend, and PostgreSQL database) with a single command.

Kubernetes Deployment

For production deployment, Kubernetes is used to manage the containers. The Kubernetes configuration includes:
	•	Deployments: For the Flask API, React frontend, and PostgreSQL database.
	•	ConfigMaps: To manage configuration settings.
	•	Secrets: To securely store sensitive information like database credentials.
	•	Ingress: To provide external access to the application.

Monitoring with Prometheus and Grafana

Prometheus is integrated to monitor the application’s health and API performance, while Grafana is used to create dashboards showing key metrics such as API response times, resource usage, and stock trends. These tools help ensure the system is running smoothly and provide valuable insights for store managers.

CI/CD with Jenkins

The CI/CD pipeline, managed by Jenkins, automates the process of building and deploying the application. The pipeline includes:
	1.	Linting: Checks Flask and React code for syntax errors.
	2.	Unit Tests: Runs backend logic unit tests to ensure correctness.
	3.	Docker Build: Builds and pushes Docker images to Docker Hub.
	4.	Deployment: Deploys the application to a Kubernetes cluster (Minikube or EKS).
	5.	Monitoring: Deploys Prometheus and Grafana alongside the application.

Running the Project Locally

To run the system locally, you can use Docker Compose:
	1.	Clone the repository.
	2.	Set up the Docker containers for Flask, React, and PostgreSQL by running:

docker-compose up --build


	3.	Access the backend API at http://localhost:5000 and the React frontend (if used) at http://localhost:3000.

Endpoints Summary

	•	GET /api/products: Retrieve all products.
	•	GET /api/products/<product_id>: Get details of a specific product.
	•	POST /api/products: Add a new product.
	•	PUT /api/products/<product_id>: Update a product’s details.
	•	DELETE /api/products/<product_id>: Remove a product.
	•	POST /api/products/<product_id>/restock: Restock a product.
	•	GET /api/restocks: View restocking logs.
	•	GET /api/products/low-stock: Get products with low stock.
	•	GET /api/products/analytics: Fetch stock trends.



This Smart Retail Inventory System provides a robust, scalable, and easy-to-use solution for managing retail inventory. With features like real-time stock tracking, restocking notifications, and insightful analytics, store managers can efficiently maintain inventory and ensure that products are always available for customers. The system leverages modern technologies such as Flask, React, PostgreSQL, Docker, Kubernetes, and Prometheus to ensure high performance, scalability, and maintainability.

