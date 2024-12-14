from flask import Blueprint, jsonify

restocks_bp = Blueprint('restocks', __name__)

@restocks_bp.route('/api/products/<product_id>/restock', methods=['POST'])
def restock_product(product_id):
    return jsonify({"message": f"POST /api/products/{product_id}/restock"})

@restocks_bp.route('/api/restocks', methods=['GET'])
def get_restocks():
    return jsonify({"message": "GET /api/restocks"})