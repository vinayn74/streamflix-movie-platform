# StreamFlix Flask Backend (MySQL + SQLAlchemy)

Production-ready REST API backend for StreamFlix platform built with Flask, SQLAlchemy, MySQL, Flask-JWT-Extended, and Flask-Bcrypt.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.9+ installed
- MySQL Server running on `localhost:3306` (Optional: SQLite fallback is active if MySQL is not running)

---

### 2. Setup Virtual Environment & Install Dependencies

```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

---

### 3. Configure Database (.env)

Create a `.env` file in `backend/` or copy `.env.example`:
```env
PORT=5000
FLASK_ENV=development
SECRET_KEY=streamflix_flask_super_secret_key_2026
JWT_SECRET_KEY=streamflix_jwt_secret_key_2026
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/streamflix_db
TMDB_API_KEY=4f4f1723d3e5c1e9571656f5152345f6
```

Before running, create the MySQL database `streamflix_db`:
```sql
CREATE DATABASE IF NOT EXISTS streamflix_db;
```

---

### 4. Run the Flask Server

```bash
python app.py
```

The Flask backend will start on **`http://localhost:5000`**.

---

## 📡 API Contract Specification

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health Check | No |
| `POST` | `/api/auth/register` | Register New User | No |
| `POST` | `/api/auth/login` | User Login & JWT Token Generation | No |
| `GET` | `/api/auth/me` | Fetch User Profile | Yes (Bearer Token) |
| `GET` | `/api/user/favorites` | Get Favorite Movies | Yes (Bearer Token) |
| `POST` | `/api/user/favorites` | Toggle Favorite Movie | Yes (Bearer Token) |
| `GET` | `/api/user/watchlist` | Get Watchlist Movies | Yes (Bearer Token) |
| `POST` | `/api/user/watchlist` | Toggle Watchlist Movie | Yes (Bearer Token) |
| `POST` | `/api/user/history` | Add to Watch History | Yes (Bearer Token) |
| `POST` | `/api/user/continue-watching` | Update Continue Watching | Yes (Bearer Token) |
