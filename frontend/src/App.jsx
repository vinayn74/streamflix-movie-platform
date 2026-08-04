import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import BannerSkeleton from './components/BannerSkeleton';

// Code-Split Lazy Loaded Page Components
const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Movies = lazy(() => import('./pages/Movies'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Genres = lazy(() => import('./pages/Genres'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Profile = lazy(() => import('./pages/Profile'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/NotFound'));

import './css/global.css';

/**
 * Main Application Shell
 * Production Architecture:
 * - Route-level code splitting with React.lazy() & Suspense
 * - Global ErrorBoundary wrapping
 * - Authenticated Guard Routes
 */
function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <ErrorBoundary>
      <div className="app-root">
        {!isAuthPage && <Navbar />}

        <main className="app-main">
          <Suspense
            fallback={
              <div className="page-container container">
                <BannerSkeleton />
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {!isAuthPage && <Footer />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
