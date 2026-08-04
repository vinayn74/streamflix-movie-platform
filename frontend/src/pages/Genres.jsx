import React, { useState, useEffect } from 'react';
import { getGenres } from '../services/tmdb';
import GenreCard from '../components/GenreCard';
import Loader from '../components/Loader';
import './Genres.css';

/**
 * Genres Component
 * Displays available movie categories and genre cards
 */
const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenresData = async () => {
      setLoading(true);
      const data = await getGenres();
      setGenres(data);
      setLoading(false);
    };

    fetchGenresData();
  }, []);

  return (
    <div className="genres-page page-container container">
      <div className="genres-header">
        <h1 className="page-title">Browse by Genre</h1>
        <p className="page-subtitle">Select your favorite genre to uncover curated movies and hidden gems.</p>
      </div>

      {loading ? (
        <Loader type="spinner" />
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
