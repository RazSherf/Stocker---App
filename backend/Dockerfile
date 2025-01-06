# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file first to leverage Docker caching
COPY requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install prometheus_client

# Copy the current directory contents into the container at /app
COPY . /app

# Make ports available to the world outside this container
EXPOSE 5000 
EXPOSE 9090  

# Set environment variables
ENV FLASK_APP=app.py
ENV PYTHONUNBUFFERED=1  

# Create a non-root user
RUN useradd -m myuser && \
    chown -R myuser:myuser /app

# Switch to non-root user
USER myuser

# Run app.py when the container launches
CMD ["python", "app.py"]