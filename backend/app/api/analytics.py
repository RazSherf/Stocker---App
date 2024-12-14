from flask import Blueprint, jsonify

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/api/products/low-stock', methods=['GET'])
def low_stock_products():
    return jsonify({"message": "GET /api/products/low-stock"})

@analytics_bp.route('/api/products/analytics', methods=['GET'])
def product_analytics():
    return jsonify({"message": "GET /api/products/analytics"})