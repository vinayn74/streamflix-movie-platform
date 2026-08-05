import React from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaGithub, FaTwitter, FaInstagram, FaYoutube, FaHeart } from 'react-icons/fa';
import './Footer.css';

/**
 * Footer Component
 * Features:
 * - Multi-column responsive streaming platform footer
 * - Brand showcase with tagline & social links
 * - Quick category navigation & support links
 * - Tech stack credentials
 */
const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-top">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="brand-icon-wrapper">
                <FaFilm className="brand-icon" />
              </div>
              <span className="brand-name">STREAM<span className="brand-accent">FLIX</span></span>
            </Link>
            <p className="footer-tagline">
              Your ultimate destination for 4K UHD streaming, trending cinema, exclusive originals, and personal movie collections.
            </p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-links-col">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-menu">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/movies">Browse Movies</Link></li>
              <li><Link to="/genres">Genres & Categories</Link></li>
              <li><Link to="/watchlist">My Watchlist</Link></li>
              <li><Link to="/favorites">Favorites</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="footer-links-col">
            <h4 className="footer-title">Popular Genres</h4>
            <ul className="footer-menu">
              <li><Link to="/genres?genre=28">Action & Adventure</Link></li>
              <li><Link to="/genres?genre=35">Comedy Classics</Link></li>
              <li><Link to="/genres?genre=18">Drama & Romance</Link></li>
              <li><Link to="/genres?genre=878">Sci-Fi & Fantasy</Link></li>
              <li><Link to="/genres?genre=27">Horror & Thriller</Link></li>
            </ul>
          </div>

          {/* Platform Info Column */}
          <div className="footer-links-col">
            <h4 className="footer-title">Tech Stack</h4>
            <ul className="footer-menu tech-stack-list">
              <li><span>React (Vite)</span></li>
              <li><span>React Router DOM</span></li>
              <li><span>TMDB API</span></li>
              <li><span>Python / Flask</span></li>
              <li><span>MySQL & JWT</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} STREAMFLIX. Built with <FaHeart className="heart-icon" /> for React Developers & Movie Enthusiasts.
          </p>
          <div className="footer-legal">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#tmdb">Powered by TMDB API</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
