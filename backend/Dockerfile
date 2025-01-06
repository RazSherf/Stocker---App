# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file first to leverage Docker caching
COPY requirements.txt /app/requirements.txt

# Install dependencies and prometheus client
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install prometheus_client

# Copy the current directory contents into the container at /app
COPY . /app

# Make ports available
EXPOSE 5000 9090

# Define environment variable
ENV FLASK_APP=app.py

# Run app.py when the container launches
CMD ["python", "app/app.py"]