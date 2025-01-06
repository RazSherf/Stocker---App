from flask import Flask
from api.products import products_bp
from api.restocks import restock_bp
from api.analytics import analytics_bp
from flask_cors import CORS
from flask import Flask, Blueprint, request, jsonify,g,Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps, RELAXED_JSON_OPTIONS
from json import loads
import os
import time
import time
import psutil
from prometheus_client import Counter, Gauge, Histogram, generate_latest

app = Flask(__name__)



CPU_USAGE = Gauge('cpu_usage_percent', 'Current CPU usage in percent')
MEMORY_USAGE = Gauge('memory_usage_bytes', 'Current memory usage in bytes')
NETWORK_IO_COUNTERS = Gauge('network_io_bytes', 'Network I/O counters', ['direction'])

# HTTP metrics
HTTP_REQUESTS = Counter('http_requests_total', 'Total number of HTTP requests', ['method', 'endpoint', 'status_code'])
HTTP_REQUEST_DURATION = Histogram('http_request_duration_seconds', 'Histogram of HTTP request durations',
                                  ['method', 'endpoint'])

@app.before_request
def track_request_start():
    # Record the start time of the request
    g.start_time = time.time()

@app.after_request
def track_request_end(response):
    # Measure request duration
    if hasattr(g, 'start_time'):
        request_duration = time.time() - g.start_time
        HTTP_REQUEST_DURATION.labels(method=request.method, endpoint=request.path).observe(request_duration)

    # Count the request
    HTTP_REQUESTS.labels(method=request.method, endpoint=request.path, status_code=response.status_code).inc()

    return response

# Metrics endpoint for Prometheus to scrape
@app.route('/metrics')
def metrics():
    # Update system metrics before serving
    CPU_USAGE.set(psutil.cpu_percent())
    MEMORY_USAGE.set(psutil.virtual_memory().used)
    net_io = psutil.net_io_counters()
    NETWORK_IO_COUNTERS.labels('in').set(net_io.bytes_recv)
    NETWORK_IO_COUNTERS.labels('out').set(net_io.bytes_sent)

    # Return Prometheus metrics in the required format
    return Response(generate_latest(), mimetype='text/plain')
    

CORS(app) 
app.register_blueprint(products_bp)
app.register_blueprint(restock_bp)
app.register_blueprint(analytics_bp)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)