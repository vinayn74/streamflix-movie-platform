import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaHeart, FaBookmark, FaStar } from 'react-icons/fa';
import { getImageUrl } from '../services/tmdb';
import { useMovie } from '../context/MovieContext';
import Modal from './Modal';
import './MovieCard.css';

/**
 * MovieCard Component
 * Reusable card representing a single movie title connected to MovieContext
 */
export const MovieCard = ({ movie }) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { isFavorite, inWatchlist, toggleFavorite, toggleWatchlist, addToHistory } = useMovie();

  if (!movie) return null;

  const favoriteActive = isFavorite(movie.id);
  const watchlistActive = inWatchlist(movie.id);

  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  const handleCardClick = () => {
    addToHistory(movie);
  };

  return (
    <>
      <div className="movie-card glass-card" onClick={handleCardClick}>
        {/* Poster Container */}
        <div className="movie-poster-wrapper">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="movie-poster-img"
            loading="lazy" 
          />
          <div className="movie-card-overlay">
            {/* Action Buttons */}
            <div className="movie-actions">
              <button 
                className={`action-btn fav-btn ${favoriteActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(movie);
                }}
                title={favoriteActive ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <FaHeart />
              </button>

              <button 
                className="play-btn-circle" 
                onClick={(e) => {
                  e.stopPropagation();
                  addToHistory(movie);
                  setIsTrailerOpen(true);
                }}
                title="Watch Trailer"
              >
                <FaPlay className="play-icon" />
              </button>

              <button 
                className={`action-btn watch-btn ${watchlistActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(movie);
                }}
                title={watchlistActive ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <FaBookmark />
              </button>
            </div>

            <Link to={`/movie/${movie.id}`} className="details-overlay-link">
              <span>View Details</span>
            </Link>
          </div>

          {/* Rating Badge */}
          <div className="card-rating-badge">
            <FaStar className="badge-star" />
            <span>{voteAverage}</span>
          </div>
        </div>

        {/* Card Metadata */}
        <div className="movie-card-info">
          <h3 className="movie-card-title" title={movie.title}>
            <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
          </h3>
          <div className="movie-card-meta">
            <span className="movie-year">{releaseYear}</span>
            <span className="media-badge">UHD 4K</span>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <Modal 
        isOpen={isTrailerOpen} 
        onClose={() => setIsTrailerOpen(false)}
        title={`${movie.title} — Official Trailer`}
      >
        <div className="video-responsive">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${movie.trailer_key || 'YoHD9XEInc0'}?autoplay=1`}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(MovieCard);
