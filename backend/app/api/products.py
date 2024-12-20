from flask import Flask, Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps
from json import loads
import os

# Initialize Flask app
app = Flask(__name__)

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
        return jsonify({"success": True, "products": loads(dumps(products))}), 200
    except Exception as e:
        return jsonify({"success!ROIF!": False, "message": str(e)}), 500

@products_bp.route('/api/products', methods=['POST'])
def add_product():
    try:
        product_data = request.json
        # Insert the product into MongoDB
        result = products_collection.insert_one(product_data)
        return jsonify({"success": True, "product_id": str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get details of a specific product."""
    try:
        product = products_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404
        return jsonify({"success": True, "product": loads(dumps(product))}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    """Update product details or stock level."""
    try:
        update_data = request.json
        if not update_data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        # Update the product in the database
        result = products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"success": False, "message": "Product not found"}), 404

        return jsonify({"success": True, "message": "Product updated"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@products_bp.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product from the inventory."""
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