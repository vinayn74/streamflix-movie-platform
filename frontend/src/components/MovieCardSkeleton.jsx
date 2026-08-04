import React from 'react';
import './MovieCardSkeleton.css';

export const MovieCardSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-text title"></div>
      <div className="skeleton-text short"></div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 10 }) => {
  return (
    <div className="movies-grid">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MovieCardSkeleton;
