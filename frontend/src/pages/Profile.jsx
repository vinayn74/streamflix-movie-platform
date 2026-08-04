import React from 'react';
import { FaUser, FaFilm, FaHeart, FaHistory, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import './Profile.css';

/**
 * Profile Component
 * Shows logged in user details, statistics, and logout button powered by useAuth
 */
const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page-container container">
      <div className="glass-card profile-card">
        <div className="profile-header-info">
          <div className="profile-avatar-large">
            {user && user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
          </div>
          <div>
            <h2>{user ? user.name : 'StreamFlix Member'}</h2>
            <p>{user ? user.email : 'member@streamflix.com'}</p>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="stat-card glass-card">
            <FaFilm className="stat-icon" />
            <h3>{user?.history?.length || 0}</h3>
            <p>Movies Watched</p>
          </div>
          <div className="stat-card glass-card">
            <FaHeart className="stat-icon heart" />
            <h3>{user?.favorites?.length || 0}</h3>
            <p>Favorite Titles</p>
          </div>
          <div className="stat-card glass-card">
            <FaHistory className="stat-icon" />
            <h3>{user?.watchlist?.length || 0}</h3>
            <p>Watchlist Items</p>
          </div>
        </div>

        <button className="btn btn-primary logout-btn" onClick={logout}>
          <FaSignOutAlt style={{ marginRight: '8px' }} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
