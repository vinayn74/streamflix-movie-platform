import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaSearch } from 'react-icons/fa';
import { useMovie } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Watchlist.css';

/**
 * Watchlist Component
 * User's personal collection of saved watchlist movies powered by MovieContext
 */
const Watchlist = () => {
  useDocumentTitle('My Watchlist');
  const { watchlist } = useMovie();
  const [filterText, setFilterText] = useState('');


  const filteredWatchlist = watchlist.filter((movie) =>
    movie.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="watchlist-page page-container container">
      {/* Header Bar */}
      <div className="collection-header">
        <div>
          <h1 className="page-title">
            <FaBookmark className="title-icon bookmark-icon" /> My Watchlist
          </h1>
          <p className="page-subtitle">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved to watch later.
          </p>
        </div>

        {watchlist.length > 0 && (
          <div className="collection-filter-form glass-card">
            <FaSearch className="filter-input-icon" />
            <input
              type="text"
              placeholder="Search in watchlist..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="collection-filter-input"
            />
          </div>
        )}
      </div>

      {/* Movie Grid */}
      {watchlist.length > 0 ? (
        filteredWatchlist.length > 0 ? (
          <div className="movies-grid">
            {filteredWatchlist.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="no-results glass-card">
            <h3>No matching watchlist items found</h3>
            <p>Try clearing your search query "{filterText}".</p>
          </div>
        )
      ) : (
        <div className="empty-collection glass-card">
          <div className="empty-icon-circle bookmark-circle">
            <FaBookmark />
          </div>
          <h2>Your Watchlist is Empty</h2>
          <p>Click the bookmark icon on any movie card to add movies to your personal watch list.</p>
          <Link to="/movies" className="btn btn-primary">
            Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
