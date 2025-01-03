from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps, RELAXED_JSON_OPTIONS
from datetime import datetime 
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

# Add at the top with other collections
restock_logs_collection = db['restock_logs']

# Create a new Blueprint for restocking operations
restock_bp = Blueprint('restock', __name__)

@restock_bp.route('/api/products/<product_id>/restock', methods=['POST'])
def restock_product(product_id):
    try:
        restock_data = request.json
        
        if not restock_data or 'quantity' not in restock_data:
            return jsonify({"success": False, "message": "Quantity is required"}), 400
        
        # Ensure quantity is an integer
        quantity = int(restock_data.get('quantity'))
        if quantity <= 0:
            return jsonify({"success": False, "message": "Quantity must be positive"}), 400

        # Get current product
        product = products_collection.find_one({"_id": ObjectId(product_id)})
        if not product:
            return jsonify({"success": False, "message": "Product not found"}), 404

        # Ensure current_stock is an integer
        current_stock = int(product.get('stock', 0))
        new_stock = current_stock + quantity

        # Create restock log with explicit types
        restock_log = {
            "product_id": ObjectId(product_id),
            "quantity": int(quantity),
            "previous_stock": int(current_stock),
            "new_stock": int(new_stock),
            "timestamp": datetime.utcnow(),
            "notes": str(restock_data.get('notes', '')),
            "status": "completed"
        }
        
        # Insert restock log
        result = restock_logs_collection.insert_one(restock_log)
        
        # Update product stock with explicit integer
        products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": {"stock": int(new_stock)}}
        )

        return jsonify({
            "success": True,
            "message": "Restock completed",
            "new_stock_level": int(new_stock),
            "restock_id": str(result.inserted_id)  # Convert ObjectId to string
        }), 200

    except ValueError as e:
        return jsonify({"success": False, "message": "Invalid number format"}), 400
    except Exception as e:
        print(f"Error in restock: {str(e)}")  # Add logging for debugging
        return jsonify({"success": False, "message": str(e)}), 500

@restock_bp.route('/api/restocks', methods=['GET'])
def get_restock_logs():
    try:
        # Get query parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        skip = (page - 1) * per_page

        # Get total count
        total = restock_logs_collection.count_documents({})

        # Get restock logs with product details using aggregation
        pipeline = [
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "product"
                }
            },
            {"$unwind": "$product"},
            {"$sort": {"timestamp": -1}},
            {"$skip": skip},
            {"$limit": per_page}
        ]
        
        restock_logs = list(restock_logs_collection.aggregate(pipeline))

        return jsonify({
            "success": True,
            "restocks": loads(dumps(restock_logs, json_options=RELAXED_JSON_OPTIONS)),
            "total": total,
            "page": page,
            "per_page": per_page
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Register the Blueprint
app.register_blueprint(restock_bp)
