import React from 'react';
import { Link } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa';
import './GenreCard.css';

/**
 * GenreCard Component
 * Interactive category tile with vibrant gradient highlights
 */
export const GenreCard = ({ genre }) => {
  if (!genre) return null;

  return (
    <Link to={`/movies?genre=${genre.id}`} className="genre-card glass-card">
      <div className="genre-card-content">
        <div className="genre-icon-bg">
          <FaFilm />
        </div>
        <h3 className="genre-name">{genre.name}</h3>
        {genre.count && <span className="genre-count">{genre.count}</span>}
      </div>
    </Link>
  );
};

export default GenreCard;
