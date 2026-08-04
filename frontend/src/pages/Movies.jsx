import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaRedo, FaFilm } from 'react-icons/fa';
import { discoverMovies, getGenres } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/MovieCardSkeleton';
import Pagination from '../components/Pagination';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Movies.css';


/**
 * Movies Component
 * Browse and filter movies by Genre, Release Year, Rating, and Popularity
 */
const Movies = () => {
  useDocumentTitle('Explore Movies');

  const [searchParams, setSearchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || '';

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters State
  const [filters, setFilters] = useState({
    genre: initialGenre,
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  });

  // Sync genre from searchParams if changed externally (e.g. from GenreCard link)
  useEffect(() => {
    const genreParam = searchParams.get('genre') || '';
    setFilters((prev) => ({ ...prev, genre: genreParam }));
  }, [searchParams]);

  // Load Genres
  useEffect(() => {
    const loadGenres = async () => {
      const data = await getGenres();
      setGenres(data);
    };
    loadGenres();
  }, []);

  // Fetch Filtered Movies
  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      const data = await discoverMovies({ ...filters, page });
      if (!isMounted) return;
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 20));
      setLoading(false);
    };

    fetchMovies();
    return () => {
      isMounted = false;
    };
  }, [filters, page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      genre: '',
      year: '',
      rating: '',
      sortBy: 'popularity.desc'
    });
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="movies-page page-container container">
      {/* Header & Filter Controls Bar */}
      <div className="movies-header">
        <div className="movies-header-logo-wrapper">
          <div className="header-logo-icon">
            <FaFilm />
          </div>
        </div>
        <div className="movies-header-text">
          <h1 className="page-title">Explore Movies</h1>
          <p className="page-subtitle">Discover thousands of movies across multiple genres and release years.</p>
        </div>
      </div>


      {/* Filter Toolbar */}
      <div className="filter-toolbar glass-card">
        <div className="filter-title">
          <FaFilter className="filter-icon" /> Filters
        </div>

        <div className="filter-inputs">
          {/* Genre Filter */}
          <select 
            name="genre" 
            value={filters.genre} 
            onChange={handleFilterChange} 
            className="filter-select"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          {/* Release Year Filter */}
          <select 
            name="year" 
            value={filters.year} 
            onChange={handleFilterChange} 
            className="filter-select"
          >
            <option value="">All Years</option>
            {Array.from({ length: 25 }, (_, i) => 2026 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Minimum Rating */}
          <select 
            name="rating" 
            value={filters.rating} 
            onChange={handleFilterChange} 
            className="filter-select"
          >
            <option value="">All Ratings</option>
            <option value="8">⭐ 8.0+ Rating</option>
            <option value="7">⭐ 7.0+ Rating</option>
            <option value="6">⭐ 6.0+ Rating</option>
          </select>

          {/* Sort By */}
          <select 
            name="sortBy" 
            value={filters.sortBy} 
            onChange={handleFilterChange} 
            className="filter-select"
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Highest Rated</option>
            <option value="primary_release_date.desc">Release Date (Newest)</option>
          </select>

          {/* Reset Filters */}
          <button className="btn btn-outline reset-filter-btn" onClick={handleResetFilters}>
            <FaRedo /> Reset
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <SkeletonGrid count={12} />
      ) : movies.length > 0 ? (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        <div className="no-results glass-card">
          <h2>No Movies Found</h2>
          <p>Try adjusting your search or filter parameters to find more titles.</p>
          <button className="btn btn-primary" onClick={handleResetFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;
