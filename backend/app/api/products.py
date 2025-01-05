from flask import Flask, Blueprint, request, jsonify, g, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps, RELAXED_JSON_OPTIONS
from json import loads
import os
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST,Gauge
import time
import psutil

# Initialize Flask app
app = Flask(__name__)
CORS(app)







# System metrics
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

# Initialize Prometheus metrics
# REQUEST_COUNT = Counter(
#     'http_requests_total',
#     'Total HTTP requests',
#     ['method', 'endpoint', 'status']
# )


# REQUEST_LATENCY = Histogram(
#     'http_request_duration_seconds',
#     'HTTP request latency',
#     ['method', 'endpoint']
# )

# MongoDB setup
MONGO_URI = os.environ.get('MONGODB_URI', "mongodb://admin:password@mongodb:27017/productdb?authSource=admin")
client = MongoClient(MONGO_URI)
db = client['productdb']
products_collection = db['products']

# Create a Blueprint for the products
products_bp = Blueprint('products', __name__)

# Middleware to track metrics
# @app.before_request
# def before_request():
#     request.start_time = time.time()

# @app.after_request
# def after_request(response):
#     # Extract endpoint from request
#     if request.endpoint:
#         endpoint = request.endpoint
#     else:
#         endpoint = 'unknown'
    
#     # Record request count
#     REQUEST_COUNT.labels(
#         method=request.method,
#         endpoint=endpoint,
#         status=response.status_code
#     ).inc()
    
#     # Record request latency
#     latency = time.time() - request.start_time
#     REQUEST_LATENCY.labels(
#         method=request.method,
#         endpoint=endpoint
#     ).observe(latency)
    
#     return response

# Metrics endpoint for Prometheus to scrape
# @app.route('/metrics')
# def metrics():
#     app.logger.info("Metrics endpoint called")
#     metrics_data = generate_latest()
#     app.logger.info(f"Generated metrics: {metrics_data[:100]}...")
#     return metrics_data, 200, {'Content-Type': CONTENT_TYPE_LATEST}

# @products_bp.route('/api/products', methods=['GET'])
# def get_products():
#     try:
#         products = list(products_collection.find())
#         return jsonify({"success": True, "products": loads(dumps(products, json_options=RELAXED_JSON_OPTIONS))}), 200
#     except Exception as e:
#         app.logger.error(f"Error in get_products: {str(e)}")
#         return jsonify({"success": False, "message": str(e)}), 500




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



@products_bp.route('/api/products', methods=['POST'])
def add_product():
    try:
        product_data = request.json
        if 'stock' not in product_data:
            product_data['stock'] = 0

        result = products_collection.insert_one(product_data)
        
        return jsonify({
            "success": True,
            "product_id": str(result.inserted_id),
            "product": loads(dumps(product_data, json_options=RELAXED_JSON_OPTIONS))
        }), 201
    except Exception as e:
        app.logger.error(f"Error in add_product: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = products_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404
        return jsonify({
            "success": True,
            "product": loads(dumps(product, json_options=RELAXED_JSON_OPTIONS))
        }), 200
    except Exception as e:
        app.logger.error(f"Error in get_product: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        update_data = request.json
        if not update_data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        result = products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"success": False, "message": "Product not found"}), 404

        updated_product = products_collection.find_one({"_id": ObjectId(product_id)})
        return jsonify({
            "success": True,
            "message": "Product updated",
            "product": loads(dumps(updated_product, json_options=RELAXED_JSON_OPTIONS))
        }), 200
    except Exception as e:
        app.logger.error(f"Error in update_product: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        result = products_collection.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            return jsonify({"success": False, "message": "Product not found"}), 404

        return jsonify({"success": True, "message": "Product deleted"}), 200
    except Exception as e:
        app.logger.error(f"Error in delete_product: {str(e)}")
        return jsonify({"success": False, "message": str(e)}), 500

# Register the Blueprint
app.register_blueprint(products_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

