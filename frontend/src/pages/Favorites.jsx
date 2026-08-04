import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { useMovie } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Favorites.css';

/**
 * Favorites Component
 * User's personal collection of favorite movies powered by MovieContext
 */
const Favorites = () => {
  useDocumentTitle('My Favorites');
  const { favorites, toggleFavorite } = useMovie();
  const [filterText, setFilterText] = useState('');


  const filteredFavorites = favorites.filter((movie) =>
    movie.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="favorites-page page-container container">
      {/* Header Bar */}
      <div className="collection-header">
        <div>
          <h1 className="page-title">
            <FaHeart className="title-icon heart-icon" /> My Favorites
          </h1>
          <p className="page-subtitle">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'} saved to your favorite collection.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="collection-filter-form glass-card">
            <FaSearch className="filter-input-icon" />
            <input
              type="text"
              placeholder="Search in favorites..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="collection-filter-input"
            />
          </div>
        )}
      </div>

      {/* Movie Grid */}
      {favorites.length > 0 ? (
        filteredFavorites.length > 0 ? (
          <div className="movies-grid">
            {filteredFavorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="no-results glass-card">
            <h3>No matching favorites found</h3>
            <p>Try clearing your search query "{filterText}".</p>
          </div>
        )
      ) : (
        <div className="empty-collection glass-card">
          <div className="empty-icon-circle">
            <FaHeart />
          </div>
          <h2>No Favorite Movies Yet</h2>
          <p>Explore movies and click the heart icon on any poster to save it here for instant access.</p>
          <Link to="/movies" className="btn btn-primary">
            Explore Blockbusters
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
