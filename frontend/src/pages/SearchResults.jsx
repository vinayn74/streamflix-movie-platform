import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdb';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { SkeletonGrid } from '../components/MovieCardSkeleton';
import Pagination from '../components/Pagination';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './SearchResults.css';

/**
 * SearchResults Component
 * Displays live search results, total count, and multi-page results
 */
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useDocumentTitle(query ? `Search: ${query}` : 'Search Movies');

  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    let isMounted = true;

    const performSearch = async () => {
      setLoading(true);
      const data = await searchMovies(query, page);
      if (!isMounted) return;
      setMovies(data.results || []);
      setTotalResults(data.total_results || (data.results ? data.results.length : 0));
      setTotalPages(Math.min(data.total_pages || 1, 20));
      setLoading(false);
    };

    performSearch();
    return () => {
      isMounted = false;
    };
  }, [query, page]);

  return (
    <div className="search-results-page page-container container">
      {/* Top Search Input */}
      <div className="search-page-hero">
        <SearchBar initialQuery={query} />
      </div>

      {/* Results Header */}
      {query && (
        <div className="search-info-bar">
          <h2>
            Search Results for <span className="highlight-query">"{query}"</span>
          </h2>
          <span className="results-count-tag">{totalResults} titles found</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <SkeletonGrid count={8} />
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
              window.scrollTo({ top: 200, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        query && (
          <div className="no-results glass-card">
            <h2>No Results Found for "{query}"</h2>
            <p>Check for spelling errors or try searching for another title or genre.</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchResults;
