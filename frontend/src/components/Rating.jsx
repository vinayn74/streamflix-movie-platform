import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import './Rating.css';

/**
 * Rating Component
 * Renders star rating display out of 10 or 5 stars
 */
export const Rating = ({ voteAverage = 0, voteCount, showValue = true }) => {
  const ratingOutOf5 = voteAverage / 2;
  const fullStars = Math.floor(ratingOutOf5);
  const hasHalfStar = ratingOutOf5 % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="rating-container">
      <div className="rating-stars" aria-label={`Rating: ${voteAverage} out of 10`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <FaStar key={`full-${i}`} className="star star-full" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="star star-half" />}
        {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="star star-empty" />
        ))}
      </div>
      {showValue && (
        <span className="rating-score">
          {voteAverage ? voteAverage.toFixed(1) : 'N/A'}
          {voteCount !== undefined && <span className="rating-count">({voteCount})</span>}
        </span>
      )}
    </div>
  );
};

export default Rating;
