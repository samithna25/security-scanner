import os
from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS
from routes.scan_routes import scan_bp

def create_app():

    app = Flask(__name__)

    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    app.register_blueprint(scan_bp)
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "service": "SkySecure Backend API"
        }), 200

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "An internal server error occurred"}), 500

    return app

if __name__ == '__main__':
    app = create_app()

    app.run(host='0.0.0.0', port=5000, debug=True)