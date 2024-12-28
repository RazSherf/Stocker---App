from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps, RELAXED_JSON_OPTIONS
from json import loads
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Get MongoDB URI from environment variable
MONGO_URI = os.environ.get('MONGODB_URI', "mongodb://admin:password@mongodb:27017/productdb?authSource=admin")
client = MongoClient(MONGO_URI)

db = client['productdb']  # Database name
products_collection = db['products']  # Collection name

# Create a Blueprint for the products
products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    try:
        products = list(products_collection.find())  # Fetch all products
        
        # Use RELAXED_JSON_OPTIONS for better ObjectId handling
        return jsonify({"success!": True, "products": loads(dumps(products, json_options=RELAXED_JSON_OPTIONS))}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products', methods=['POST'])
def add_product():
    try:
        product_data = request.json
        if 'stock' not in product_data:
            product_data['stock'] = 0

        # Insert the product into MongoDB
        result = products_collection.insert_one(product_data)
        
        return jsonify({
            "success": True,
            "product_id": str(result.inserted_id),
            "product": loads(dumps(product_data, json_options=RELAXED_JSON_OPTIONS))
        }), 201
    except Exception as e:
        return jsonify({"success!!": False, "message": str(e)}), 500

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

        # Get the updated product
        updated_product = products_collection.find_one({"_id": ObjectId(product_id)})
        return jsonify({
            "success": True,
            "message": "Product updated",
            "product": loads(dumps(updated_product, json_options=RELAXED_JSON_OPTIONS))
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        result = products_collection.delete_one({"_id": ObjectId(product_id)})
        if result.deleted_count == 0:
            return jsonify({"success": False, "message": "Product not found"}), 404

        return jsonify({"success": True, "message": "Product deleted"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Register the Blueprint
app.register_blueprint(products_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)