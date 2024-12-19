from flask import Blueprint, jsonify

products_bp = Blueprint('products', __name__)

@products_bp.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({"message": "Hello1111"})

@products_bp.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    return jsonify({"message": f"GET /api/products/{product_id}"})

@products_bp.route('/api/products', methods=['POST'])
def add_product():
    return jsonify({"message": "POST /api/products"})

@products_bp.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    return jsonify({"message": f"PUT /api/products/{product_id}"})

@products_bp.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    return jsonify({"message": f"DELETE /api/products/{product_id}"})