import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css';

/**
 * Pagination Component
 * Pagination controls for navigating multi-page movie grids
 */
export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="pagination-container">
      <button
        className="btn pagination-btn"
        disabled={currentPage === 1}
        onClick={handlePrev}
      >
        <FaChevronLeft /> Prev
      </button>

      <span className="pagination-info">
        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
      </span>

      <button
        className="btn pagination-btn"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Next <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
