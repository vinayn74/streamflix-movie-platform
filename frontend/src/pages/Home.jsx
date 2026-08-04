import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaInfoCircle, FaStar, FaFire } from 'react-icons/fa';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies, 
  getNowPlayingMovies,
  getImageUrl 
} from '../services/tmdb';
import MovieCarousel from '../components/MovieCarousel';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { useMovie } from '../context/MovieContext';
import './Home.css';

/**
 * Home Component
 * Netflix/Disney+ Inspired Home Dashboard displaying Hero Feature & Movie Rows
 */
const Home = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { user } = useAuth();
  const { history, continueWatching } = useMovie();

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      const [trendingRes, popularRes, topRatedRes, upcomingRes, nowPlayingRes] = await Promise.all([
        getTrendingMovies('day'),
        getPopularMovies(1),
        getTopRatedMovies(1),
        getUpcomingMovies(1),
        getNowPlayingMovies(1)
      ]);

      setTrending(trendingRes);
      setPopular(popularRes);
      setTopRated(topRatedRes);
      setUpcoming(upcomingRes);
      setNowPlaying(nowPlayingRes);

      // Select featured hero movie
      if (trendingRes && trendingRes.length > 0) {
        setHeroMovie(trendingRes[0]);
      }
      setLoading(false);
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="page-container container">
        <Loader type="spinner" />
      </div>
    );
  }

  const backdropUrl = heroMovie ? getImageUrl(heroMovie.backdrop_path, 'original') : '';
  const voteAvg = heroMovie?.vote_average ? heroMovie.vote_average.toFixed(1) : '8.8';

  return (
    <div className="home-page">
      {/* Dynamic Hero Spotlight Banner */}
      {heroMovie && (
        <section className="hero-banner" style={{ backgroundImage: `url(${backdropUrl})` }}>
          <div className="hero-overlay"></div>
          <div className="hero-content container">
            <div className="hero-badge">
              <FaFire className="badge-fire-icon" /> #1 Trending Today
            </div>
            <h1 className="hero-title">{heroMovie.title}</h1>
            
            <div className="hero-meta">
              <span className="hero-rating">
                <FaStar className="star-icon" /> {voteAvg} Rating
              </span>
              <span className="hero-year">{heroMovie.release_date ? heroMovie.release_date.split('-')[0] : '2024'}</span>
              <span className="hero-quality">4K ULTRA HD</span>
              <span className="hero-audio">5.1 SURROUND</span>
            </div>

            <p className="hero-overview">
              {heroMovie.overview || 'Stream blockbuster movies and exclusive originals in stunning 4K resolution.'}
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary hero-btn" onClick={() => setIsTrailerOpen(true)}>
                <FaPlay style={{ marginRight: '8px' }} /> Watch Trailer
              </button>
              <Link to={`/movie/${heroMovie.id}`} className="btn btn-outline hero-btn">
                <FaInfoCircle style={{ marginRight: '8px' }} /> More Details
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Movie Content Rows */}
      <div className="home-content container">
        {/* Dynamic Personal Rows */}
        {continueWatching.length > 0 && (
          <MovieCarousel title="▶️ Continue Watching" movies={continueWatching} />
        )}
        {history.length > 0 && (
          <MovieCarousel title="🕒 Recently Viewed" movies={history} />
        )}

        {/* Global Catalog Rows */}
        <MovieCarousel title="🔥 Trending Now" movies={trending} />
        <MovieCarousel title="🌟 Popular on StreamFlix" movies={popular} />
        <MovieCarousel title="🏆 Top Rated Masterpieces" movies={topRated} />
        <MovieCarousel title="🎬 Upcoming Releases" movies={upcoming} />
        <MovieCarousel title="🍿 Now Playing in Theaters" movies={nowPlaying} />
      </div>

      {/* Hero Trailer Modal */}
      {heroMovie && (
        <Modal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          title={`${heroMovie.title} — Official Trailer`}
        >
          <div className="video-responsive">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${heroMovie.trailer_key || 'YoHD9XEInc0'}?autoplay=1`}
              title={`${heroMovie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
