import React from 'react';
import './MovieCardSkeleton.css';

export const BannerSkeleton = () => {
  return (
    <div
      className="skeleton-card"
      style={{
        width: '100%',
        height: '70vh',
        minHeight: '400px',
        maxHeight: '650px',
        borderRadius: '16px',
        marginBottom: '2rem',
      }}
    >
      <div className="skeleton-text title" style={{ width: '40%', height: '36px' }}></div>
      <div className="skeleton-text" style={{ width: '60%', height: '16px' }}></div>
      <div className="skeleton-text short" style={{ width: '30%', height: '16px' }}></div>
    </div>
  );
};

export default BannerSkeleton;
