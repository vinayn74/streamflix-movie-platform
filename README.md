# 🎬 StreamFlix - Movie & TV Show Suggestion Platform

StreamFlix is a full-stack, modern streaming and movie recommendation web application built with **React (Vite)** on the frontend and a **Python Flask REST API** on the backend with **SQLAlchemy ORM** supporting both **SQLite** and **MySQL**.

---

## 🌟 Key Features

* **Modern Glassmorphism UI**: High-performance, responsive user interface with dark theme and smooth micro-animations.
* **Real-time Movie & TV Data**: Powered by **TMDB (The Movie Database API)** for trending movies, top-rated series, search, trailer video previews, and detailed metadata.
* **User Authentication**: Secure JWT-based registration and login system with password hashing via **Bcrypt**.
* **Personalized User Features**:
  * ❤️ **Favorites**: Save and manage your favorite movies and TV shows.
  * 🔖 **Watchlist**: Bookmark titles to watch later.
  * 📜 **Watch History**: Track viewed content history.
  * ⏯️ **Continue Watching**: Resume content with dynamic progress tracking.
* **Dual Database Flexibility**:
  * 🛠️ **SQLite**: Default out-of-the-box local database with zero manual database setup required.
  * 🐬 **MySQL**: Production-ready relational database support via Flask-SQLAlchemy.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 18 (Vite)
* **Routing**: React Router v6
* **HTTP Client**: Axios (with centralized JWT interceptors)
* **Styling**: Vanilla CSS (Modern Design System, CSS Variables, Glassmorphism)
* **Icons**: React Icons

### **Backend**
* **Framework**: Python Flask
* **ORM**: Flask-SQLAlchemy
* **Authentication**: Flask-JWT-Extended
* **Security**: Flask-Bcrypt
* **CORS**: Flask-CORS
* **Environment Configuration**: `python-dotenv`

### **Database & External APIs**
* **Database**: SQLite (Development) / MySQL (Production)
* **Third-Party API**: TMDB (The Movie Database API)

---

## 📁 Project Architecture

```text
moviesuggest/
├── backend/                  # Flask REST API Backend
│   ├── models/               # SQLAlchemy Database Models (User, Favorite, Watchlist, etc.)
│   ├── routes/               # Blueprint API Routes (auth_routes.py, user_routes.py)
│   ├── services/             # TMDB Service Integration
│   ├── utils/                # Response Helpers & Utilities
│   ├── instance/             # SQLite Database Storage (streamflix.db)
│   ├── app.py                # Main Flask Application Entry Point
│   ├── config.py             # Application Configuration & DB Settings
│   ├── extensions.py         # Flask Extension Initializations
│   ├── requirements.txt      # Python Dependencies
│   └── .env.example          # Backend Environment Template
│
└── frontend/                 # React + Vite Frontend Web App
    ├── src/
    │   ├── components/       # UI Components (Navbar, MovieCard, HeroBanner, VideoModal)
    │   ├── context/          # Global Context Providers (AuthContext, ThemeContext)
    │   ├── pages/            # Page Views (Home, Movies, TVShows, Profile, Search)
    │   ├── services/         # Axios API Client Setup
    │   ├── App.jsx           # Main App Routes & Layout
    │   └── main.jsx          # React Root Mounting Point
    ├── package.json          # Frontend Dependencies & Scripts
    └── vite.config.js        # Vite Build Configuration
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v18+ and **npm** installed
* **Python** 3.9+ installed
* *(Optional)* **MySQL Server** running on `localhost:3306`

---

### 1️⃣ Setting Up the Backend

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment**:
   * **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in the `backend/` folder (or copy `.env.example`):
   ```env
   PORT=5000
   FLASK_ENV=development
   SECRET_KEY=streamflix_flask_super_secret_key_2026
   JWT_SECRET_KEY=streamflix_jwt_secret_key_2026
   
   # Leave commented to use default SQLite database in backend/instance/streamflix.db
   # DATABASE_URL=mysql+pymysql://root:password@localhost:3306/streamflix_db
   
   TMDB_API_KEY=4f4f1723d3e5c1e9571656f5152345f6
   ```

5. **Start the Flask Development Server**:
   ```bash
   python app.py
   ```
   The Flask API server will start on **`http://localhost:5000`**.

---

### 2️⃣ Setting Up the Frontend

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The React web app will start on **`http://localhost:5173`**.

---

## 📡 REST API Documentation

### 🔑 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/me` | Retrieve currently authenticated user profile | Yes (Bearer Token) |

---

### 👤 User Features Endpoints (`/api/user`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/favorites` | Fetch user's favorite movies/shows | Yes (Bearer Token) |
| `POST` | `/api/user/favorites` | Add/Remove title from favorites | Yes (Bearer Token) |
| `GET` | `/api/user/watchlist` | Fetch user's watchlist | Yes (Bearer Token) |
| `POST` | `/api/user/watchlist` | Add/Remove title from watchlist | Yes (Bearer Token) |
| `POST` | `/api/user/history` | Log a title into watch history | Yes (Bearer Token) |
| `POST` | `/api/user/continue-watching` | Update watch progress percentage | Yes (Bearer Token) |

---

### 🏥 System Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | API Health Check Endpoint | No |

---

## 💾 Database Configuration

* **SQLite (Default)**: If `DATABASE_URL` is omitted from `backend/.env`, Flask automatically creates and uses an SQLite database located at `backend/instance/streamflix.db`.
* **MySQL Database**: To switch to MySQL, make sure MySQL Server is running and create the target database in MySQL:
  ```sql
  CREATE DATABASE IF NOT EXISTS streamflix_db;
  ```
  Then uncomment and set `DATABASE_URL` in `backend/.env`:
  ```env
  DATABASE_URL=mysql+pymysql://<user>:<password>@localhost:3306/streamflix_db
  ```

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
