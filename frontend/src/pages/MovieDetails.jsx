import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaPlay, 
  FaHeart, 
  FaBookmark, 
  FaStar, 
  FaClock, 
  FaCalendarAlt, 
  FaUserTie,
  FaArrowLeft
} from 'react-icons/fa';
import { 
  getMovieDetails, 
  getMovieCredits, 
  getMovieVideos, 
  getSimilarMovies, 
  getImageUrl 
} from '../services/tmdb';
import MovieCarousel from '../components/MovieCarousel';
import Modal from '../components/Modal';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import './MovieDetails.css';

/**
 * MovieDetails Component
 * Complete detail view for a movie including backdrop, cast, director, trailer, and recommendations
 */
const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const [movieData, creditsData, videosData, similarData] = await Promise.all([
        getMovieDetails(id),
        getMovieCredits(id),
        getMovieVideos(id),
        getSimilarMovies(id)
      ]);

      setMovie(movieData);
      setCredits(creditsData);
      setVideos(videosData);
      setSimilar(similarData);
      setLoading(false);
    };

    fetchAllDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container container">
        <Loader type="spinner" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="page-container container">
        <div className="glass-card error-card">
          <h2>Movie Not Found</h2>
          <p>The requested movie details could not be retrieved.</p>
          <Link to="/movies" className="btn btn-primary">Back to Movies</Link>
        </div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const director = credits?.crew?.find((person) => person.job === 'Director');
  const trailerKey = videos?.find((v) => v.type === 'Trailer' || v.type === 'Teaser')?.key || movie.trailer_key || 'YoHD9XEInc0';

  return (
    <div className="movie-details-page">
      {/* Hero Backdrop Header */}
      <div className="details-hero" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="details-hero-overlay"></div>
        <div className="details-hero-content container">
          <Link to="/movies" className="back-link">
            <FaArrowLeft /> Back to Browse
          </Link>

          <div className="details-main-flex">
            {/* Poster */}
            <div className="details-poster-card glass-card">
              <img src={posterUrl} alt={movie.title} />
              <button 
                className="btn btn-primary details-play-btn"
                onClick={() => setIsTrailerOpen(true)}
              >
                <FaPlay style={{ marginRight: '8px' }} /> Watch Trailer
              </button>
            </div>

            {/* Info Body */}
            <div className="details-info-body">
              <h1 className="details-title">{movie.title}</h1>
              {movie.tagline && <p className="details-tagline">"{movie.tagline}"</p>}

              {/* Meta Pill Badges */}
              <div className="details-meta-row">
                <Rating voteAverage={movie.vote_average} voteCount={movie.vote_count} />
                
                {movie.runtime && (
                  <span className="meta-pill">
                    <FaClock className="pill-icon" /> {movie.runtime} min
                  </span>
                )}

                {movie.release_date && (
                  <span className="meta-pill">
                    <FaCalendarAlt className="pill-icon" /> {movie.release_date}
                  </span>
                )}

                <span className="meta-pill quality-pill">4K UHD</span>
              </div>

              {/* Genre Pills */}
              <div className="genre-pills">
                {movie.genres?.map((genre) => (
                  <Link 
                    key={genre.id} 
                    to={`/movies?genre=${genre.id}`}
                    className="genre-tag"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              {/* Overview */}
              <div className="details-section">
                <h3>Overview</h3>
                <p className="details-overview-text">{movie.overview}</p>
              </div>

              {/* Key Crew */}
              {director && (
                <div className="crew-info">
                  <FaUserTie className="crew-icon" />
                  <div>
                    <span className="crew-role">Director</span>
                    <span className="crew-name">{director.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section & Recommendations */}
      <div className="details-body-content container">
        {credits?.cast && credits.cast.length > 0 && (
          <section className="cast-section">
            <h2 className="section-title">Top Cast & Performers</h2>
            <div className="cast-grid">
              {credits.cast.slice(0, 6).map((actor) => (
                <div key={actor.id} className="cast-card glass-card">
                  <div className="cast-avatar">
                    {actor.profile_path ? (
                      <img src={getImageUrl(actor.profile_path, 'w185')} alt={actor.name} />
                    ) : (
                      <div className="avatar-placeholder">{actor.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="cast-name">{actor.name}</div>
                  <div className="cast-character">{actor.character}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies Carousel */}
        {similar && similar.length > 0 && (
          <MovieCarousel title="You Might Also Like" movies={similar} />
        )}
      </div>

      {/* Trailer Modal */}
      <Modal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={`${movie.title} — Trailer`}
      >
        <div className="video-responsive">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1`}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default MovieDetails;
