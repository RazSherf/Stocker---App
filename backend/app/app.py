from flask import Flask
from api.products import products_bp
from api.restocks import restocks_bp
from api.analytics import analytics_bp
from flask_cors import CORS

app = Flask(__name__)

CORS(app) 
app.register_blueprint(products_bp)
app.register_blueprint(restocks_bp)
app.register_blueprint(analytics_bp)

if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000)