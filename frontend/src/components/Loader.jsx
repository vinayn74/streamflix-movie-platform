import React from 'react';
import './Loader.css';

/**
 * Loader Component
 * Renders skeleton card grids or spinning loader for async state
 */
export const Loader = ({ type = 'spinner', count = 6 }) => {
  if (type === 'skeleton') {
    return (
      <div className="skeleton-grid">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="skeleton-card">
            <div className="skeleton-poster"></div>
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;
