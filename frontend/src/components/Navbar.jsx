import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaFilm, 
  FaSearch, 
  FaSun, 
  FaMoon, 
  FaUser, 
  FaHeart, 
  FaBookmark,
  FaBars,
  FaTimes 
} from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import { useMovie } from '../context/MovieContext';
import './Navbar.css';

/**
 * Navbar Component
 * Powered by AuthContext, ThemeContext, and MovieContext
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { favorites, watchlist } = useMovie();
  const navigate = useNavigate();

  // Scroll listener to add background depth on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <FaFilm className="brand-icon" />
          </div>
          <span className="brand-name">STREAM<span className="brand-accent">FLIX</span></span>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Center Navigation Links */}
        <nav className={`navbar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink 
            to="/home" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/movies" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Movies
          </NavLink>
          <NavLink 
            to="/genres" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Genres
          </NavLink>
          <NavLink 
            to="/watchlist" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaBookmark className="nav-icon" /> Watchlist
            {watchlist.length > 0 && <span className="nav-badge">{watchlist.length}</span>}
          </NavLink>
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaHeart className="nav-icon" /> Favorites
            {favorites.length > 0 && <span className="nav-badge fav-badge">{favorites.length}</span>}
          </NavLink>
        </nav>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {/* Quick Search Form */}
          <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
            <input 
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <FaSearch />
            </button>
          </form>

          {/* Dark / Light Theme Toggle */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun className="theme-icon sun" /> : <FaMoon className="theme-icon moon" />}
          </button>

          {/* User Auth Buttons or Profile Badge */}
          {user ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="profile-badge-link">
                <div className="avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                </div>
                <span className="profile-name">{user.name ? user.name.split(' ')[0] : 'User'}</span>
              </Link>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline nav-auth-btn">Sign In</Link>
              <Link to="/register" className="btn btn-primary nav-auth-btn">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
