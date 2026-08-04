import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaHistory, FaFilm } from 'react-icons/fa';
import { searchMovies } from '../services/tmdb';
import './SearchBar.css';

/**
 * SearchBar Component
 * Features: Live search suggestions, input debouncing, search history local storage
 */
export const SearchBar = ({ initialQuery = '', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('streamflix_search_history');
    return saved ? JSON.parse(saved) : ['Inception', 'Interstellar', 'Avengers', 'Batman'];
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const data = await searchMovies(query.trim());
      setSuggestions(data.results.slice(0, 5));
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...history.filter((item) => item.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 6);
    setHistory(updated);
    localStorage.setItem('streamflix_search_history', JSON.stringify(updated));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveToHistory(query.trim());
      setShowDropdown(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSelectSuggestion = (title) => {
    setQuery(title);
    saveToHistory(title);
    setShowDropdown(false);
    if (onSearch) {
      onSearch(title);
    } else {
      navigate(`/search?q=${encodeURIComponent(title)}`);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('streamflix_search_history');
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form className="search-bar-form glass-card" onSubmit={handleFormSubmit}>
        <FaSearch className="search-bar-icon" />
        <input
          type="text"
          className="search-bar-input"
          placeholder="Search movies, genres, actors..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        {query && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
          >
            <FaTimes />
          </button>
        )}
        <button type="submit" className="btn btn-primary search-submit-btn">
          Search
        </button>
      </form>

      {/* Live Suggestions & History Dropdown */}
      {showDropdown && (
        <div className="search-dropdown glass-card">
          {/* Debounced Suggestions */}
          {query.trim() && (
            <div className="dropdown-section">
              <div className="dropdown-section-title">
                {isSearching ? 'Searching...' : 'Suggestions'}
              </div>
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(item.title)}
                  >
                    <FaFilm className="item-icon" />
                    <span className="item-title">{item.title}</span>
                    <span className="item-year">
                      {item.release_date ? item.release_date.split('-')[0] : ''}
                    </span>
                  </div>
                ))
              ) : (
                !isSearching && <div className="no-suggestions">No movies found</div>
              )}
            </div>
          )}

          {/* Search History */}
          {!query.trim() && history.length > 0 && (
            <div className="dropdown-section">
              <div className="dropdown-section-header">
                <span className="dropdown-section-title">Recent Searches</span>
                <button className="clear-history-btn" onClick={handleClearHistory}>
                  Clear
                </button>
              </div>
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => handleSelectSuggestion(item)}
                >
                  <FaHistory className="item-icon history-icon" />
                  <span className="item-title">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
