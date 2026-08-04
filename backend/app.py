import os
from flask import Flask, jsonify
from config import Config
from extensions import db, jwt, bcrypt, cors
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(
        app, 
        resources={r"/api/*": {"origins": "*"}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)

    # Health Check Endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'ok',
            'message': 'StreamFlix Flask REST API Backend Running v1.0.0',
            'engine': 'Python Flask + SQLAlchemy + MySQL'
        }), 200

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'message': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'message': 'Internal server error'}), 500

    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({'message': 'Not authorized, no token provided'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({'message': 'Not authorized, token failed'}), 401

    # Database Initialization
    with app.app_context():
        try:
            db.create_all()
            print("Database initialized successfully.")
        except Exception as e:
            print(f"Database initialization notice: {e}")

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
