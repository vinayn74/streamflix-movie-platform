import React, { useState, useEffect } from 'react';
import { getGenres } from '../services/tmdb';
import GenreCard from '../components/GenreCard';
import { SkeletonGrid } from '../components/MovieCardSkeleton';
import useDocumentTitle from '../hooks/useDocumentTitle';
import './Genres.css';

/**
 * Genres Component
 * Displays available movie categories and genre cards
 */
const Genres = () => {
  useDocumentTitle('Browse Genres');
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchGenresData = async () => {
      setLoading(true);
      const data = await getGenres();
      if (isMounted) {
        setGenres(data || []);
        setLoading(false);
      }
    };

    fetchGenresData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="genres-page page-container container">
      <div className="genres-header">
        <h1 className="page-title">Browse by Genre</h1>
        <p className="page-subtitle">Select your favorite genre to uncover curated movies and hidden gems.</p>
      </div>

      {loading ? (
        <SkeletonGrid count={8} />
      ) : (
        <div className="genres-grid">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;
