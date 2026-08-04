import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'streamflix_flask_super_secret_key_2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'streamflix_jwt_secret_key_2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
    
    # Primary MySQL connection string with SQLite fallback
    MYSQL_URI = os.getenv(
        'DATABASE_URL', 
        'sqlite:///streamflix.db'
    )
    
    SQLALCHEMY_DATABASE_URI = MYSQL_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    TMDB_API_KEY = os.getenv('TMDB_API_KEY', '4f4f1723d3e5c1e9571656f5152345f6')
    CORS_HEADERS = 'Content-Type'
