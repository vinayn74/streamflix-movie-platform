import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import './MovieCarousel.css';

/**
 * MovieCarousel Component
 * Horizontal slider row displaying movie cards with left/right scroll controls
 */
export const MovieCarousel = ({ title, movies = [], loading = false, onToggleFavorite, onToggleWatchlist }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="section-title">{title}</h2>
        <div className="carousel-controls">
          <button 
            className="carousel-btn btn-left" 
            onClick={() => handleScroll('left')} 
            aria-label="Scroll Left"
          >
            <FaChevronLeft />
          </button>
          <button 
            className="carousel-btn btn-right" 
            onClick={() => handleScroll('right')} 
            aria-label="Scroll Right"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="carousel-row">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="carousel-item">
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className="carousel-row" ref={rowRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="carousel-item">
              <MovieCard 
                movie={movie} 
                onToggleFavorite={onToggleFavorite}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default React.memo(MovieCarousel);

