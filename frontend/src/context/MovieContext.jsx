import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import API from '../services/api';
import useAuth from '../hooks/useAuth';

export const MovieContext = createContext();

/**
 * MovieProvider Component
 * Manages user's Favorites, Watchlist, Recently Viewed History, and Continue Watching state
 */
export const MovieProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('streamflix_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('streamflix_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('streamflix_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [continueWatching, setContinueWatching] = useState(() => {
    const saved = localStorage.getItem('streamflix_continue_watching');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state from logged-in user profile on load or user change
  useEffect(() => {
    if (user) {
      if (user.favorites) setFavorites(user.favorites);
      if (user.watchlist) setWatchlist(user.watchlist);
      if (user.history) setHistory(user.history);
      if (user.continueWatching) setContinueWatching(user.continueWatching);
    }
  }, [user]);

  // Persist state snapshots to localStorage
  useEffect(() => {
    localStorage.setItem('streamflix_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('streamflix_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('streamflix_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('streamflix_continue_watching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  // Checkers
  const isFavorite = useCallback((movieId) => favorites.some((m) => m.id === Number(movieId)), [favorites]);
  const inWatchlist = useCallback((movieId) => watchlist.some((m) => m.id === Number(movieId)), [watchlist]);

  // Toggle Favorite
  const toggleFavorite = useCallback(async (movie) => {
    const exists = favorites.some((m) => m.id === Number(movie.id));
    let updated;
    if (exists) {
      updated = favorites.filter((m) => m.id !== Number(movie.id));
    } else {
      updated = [movie, ...favorites];
    }
    setFavorites(updated);

    if (isAuthenticated) {
      try {
        await API.post('/user/favorites', movie);
      } catch (err) {
        console.warn('Sync favorite error:', err.message);
      }
    }
  }, [favorites, isAuthenticated]);

  // Toggle Watchlist
  const toggleWatchlist = useCallback(async (movie) => {
    const exists = watchlist.some((m) => m.id === Number(movie.id));
    let updated;
    if (exists) {
      updated = watchlist.filter((m) => m.id !== Number(movie.id));
    } else {
      updated = [movie, ...watchlist];
    }
    setWatchlist(updated);

    if (isAuthenticated) {
      try {
        await API.post('/user/watchlist', movie);
      } catch (err) {
        console.warn('Sync watchlist error:', err.message);
      }
    }
  }, [watchlist, isAuthenticated]);

  // Add to History
  const addToHistory = useCallback(async (movie) => {
    const updated = [movie, ...history.filter((m) => m.id !== Number(movie.id))].slice(0, 20);
    setHistory(updated);

    if (isAuthenticated) {
      try {
        await API.post('/user/history', movie);
      } catch (err) {
        console.warn('Sync history error:', err.message);
      }
    }
  }, [history, isAuthenticated]);

  // Update Continue Watching
  const updateContinueWatching = useCallback(async (movie, progress = 50) => {
    const updatedItem = { ...movie, progress, updatedAt: new Date() };
    const updated = [updatedItem, ...continueWatching.filter((m) => m.id !== Number(movie.id))];
    setContinueWatching(updated);

    if (isAuthenticated) {
      try {
        await API.post('/user/continue-watching', { movie, progress });
      } catch (err) {
        console.warn('Sync continue watching error:', err.message);
      }
    }
  }, [continueWatching, isAuthenticated]);

  const value = useMemo(() => ({
    favorites,
    watchlist,
    history,
    continueWatching,
    isFavorite,
    inWatchlist,
    toggleFavorite,
    toggleWatchlist,
    addToHistory,
    updateContinueWatching,
  }), [
    favorites,
    watchlist,
    history,
    continueWatching,
    isFavorite,
    inWatchlist,
    toggleFavorite,
    toggleWatchlist,
    addToHistory,
    updateContinueWatching,
  ]);

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom Hook to consume MovieContext
export const useMovie = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovie must be used within a MovieProvider');
  }
  return context;
};

export default MovieContext;

