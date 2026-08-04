import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page page-container container">
      <div className="glass-card not-found-card">
        <FaExclamationTriangle className="warning-icon" />
        <h1 className="error-code">404</h1>
        <h2>Lost in Space?</h2>
        <p>The movie reel or page you were looking for doesn't exist or has been moved.</p>
        <Link to="/home" className="btn btn-primary">
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
