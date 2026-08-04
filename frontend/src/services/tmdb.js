import axios from 'axios';

// TMDB API Base Configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Default API Key check from process environment or Vite env
const API_KEY = import.meta.env?.VITE_TMDB_API_KEY || '4f4f1723d3e5c1e9571656f5152345f6'; 

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Curated High-Quality Fallback Dataset for instant playback & testing
const MOCK_MOVIES = [
  {
    id: 550,
    title: 'Fight Club',
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    poster_path: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.4,
    release_date: '1999-10-15',
    genre_ids: [18, 53],
    runtime: 139,
    trailer_key: 'BdJKm16Co6M'
  },
  {
    id: 27205,
    title: 'Inception',
    overview: 'Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.8,
    release_date: '2010-07-16',
    genre_ids: [28, 878, 12],
    runtime: 148,
    trailer_key: 'YoHD9XEInc0'
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.',
    poster_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.6,
    release_date: '2014-11-05',
    genre_ids: [12, 18, 878],
    runtime: 169,
    trailer_key: 'zSWdZVtXT7E'
  },
  {
    id: 155,
    title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    poster_path: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.9,
    release_date: '2008-07-18',
    genre_ids: [28, 80, 18],
    runtime: 152,
    trailer_key: 'EXeTwQWrcwY'
  },
  {
    id: 299536,
    title: 'Avengers: Infinity War',
    overview: 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.',
    poster_path: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?q=80&w=1600&auto=format&fit=crop',
    vote_average: 8.3,
    release_date: '2018-04-25',
    genre_ids: [28, 12, 878],
    runtime: 149,
    trailer_key: '6ZfuNTqbHE8'
  },
  {
    id: 19995,
    title: 'Avatar',
    overview: 'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.',
    poster_path: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop_path: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    vote_average: 7.6,
    release_date: '2009-12-15',
    genre_ids: [28, 12, 14, 878],
    runtime: 162,
    trailer_key: '5PSL13E50e0'
  }
];

export const MOCK_GENRES = [
  { id: 28, name: 'Action', count: '1,420 Movies' },
  { id: 12, name: 'Adventure', count: '980 Movies' },
  { id: 16, name: 'Animation', count: '650 Movies' },
  { id: 35, name: 'Comedy', count: '2,100 Movies' },
  { id: 80, name: 'Crime', count: '870 Movies' },
  { id: 18, name: 'Drama', count: '3,400 Movies' },
  { id: 14, name: 'Fantasy', count: '720 Movies' },
  { id: 27, name: 'Horror', count: '1,150 Movies' },
  { id: 878, name: 'Sci-Fi', count: '1,280 Movies' },
  { id: 53, name: 'Thriller', count: '1,890 Movies' },
];

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache
const memoryCache = new Map();

const getCacheKey = (endpoint, params) => `${endpoint}:${JSON.stringify(params)}`;

// Helper wrapper handling TMDB requests with 15-minute caching & fallback resilience
const fetchTMDB = async (endpoint, params = {}) => {
  const cacheKey = getCacheKey(endpoint, params);
  const now = Date.now();

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    memoryCache.delete(cacheKey);
  }

  // 2. Check localStorage cache
  try {
    const local = localStorage.getItem(`tmdb_cache_${cacheKey}`);
    if (local) {
      const parsed = JSON.parse(local);
      if (now - parsed.timestamp < CACHE_TTL_MS) {
        memoryCache.set(cacheKey, parsed);
        return parsed.data;
      }
    }
  } catch (e) {
    // Ignore storage read error
  }

  // 3. Perform network call
  try {
    const response = await tmdbApi.get(endpoint, { params });
    const data = response.data;
    const cacheObj = { timestamp: now, data };
    memoryCache.set(cacheKey, cacheObj);
    try {
      localStorage.setItem(`tmdb_cache_${cacheKey}`, JSON.stringify(cacheObj));
    } catch (e) {
      // Ignore quota full
    }
    return data;
  } catch (error) {
    console.warn(`TMDB API call to ${endpoint} failed, utilizing curated dataset:`, error.message);
    return null;
  }
};

// Concurrent batch loader for Homepage
export const getHomePageData = async () => {
  const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
    getTrendingMovies('week'),
    getPopularMovies(1),
    getTopRatedMovies(1),
    getUpcomingMovies(1),
    getNowPlayingMovies(1)
  ]);
  return { trending, popular, topRated, upcoming, nowPlaying };
};

// 1. Fetch Trending Movies
export const getTrendingMovies = async (timeWindow = 'day') => {
  const data = await fetchTMDB(`/trending/movie/${timeWindow}`);
  if (data && data.results && data.results.length > 0) return data.results;
  return MOCK_MOVIES;
};

// 2. Fetch Popular Movies
export const getPopularMovies = async (page = 1) => {
  const data = await fetchTMDB('/movie/popular', { page });
  if (data && data.results && data.results.length > 0) return data.results;
  return MOCK_MOVIES;
};

// 3. Fetch Top Rated Movies
export const getTopRatedMovies = async (page = 1) => {
  const data = await fetchTMDB('/movie/top_rated', { page });
  if (data && data.results && data.results.length > 0) return data.results;
  return MOCK_MOVIES;
};

// 4. Fetch Upcoming Movies
export const getUpcomingMovies = async (page = 1) => {
  const data = await fetchTMDB('/movie/upcoming', { page });
  if (data && data.results && data.results.length > 0) return data.results;
  return MOCK_MOVIES;
};

// 5. Fetch Now Playing Movies
export const getNowPlayingMovies = async (page = 1) => {
  const data = await fetchTMDB('/movie/now_playing', { page });
  if (data && data.results && data.results.length > 0) return data.results;
  return MOCK_MOVIES;
};

// 6. Fetch Movie Details
export const getMovieDetails = async (movieId) => {
  const data = await fetchTMDB(`/movie/${movieId}`);
  if (data) return data;
  const found = MOCK_MOVIES.find((m) => m.id === Number(movieId));
  return (
    found || {
      id: movieId,
      title: 'StreamFlix Movie Spotlight',
      overview: 'Experience high definition 4K streaming with surround audio.',
      vote_average: 8.5,
      release_date: '2024-01-01',
      genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
      runtime: 142,
    }
  );
};

// 7. Fetch Movie Credits (Cast & Director)
export const getMovieCredits = async (movieId) => {
  const data = await fetchTMDB(`/movie/${movieId}/credits`);
  if (data) return data;
  return {
    cast: [
      { id: 1, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profile_path: null },
      { id: 2, name: 'Joseph Gordon-Levitt', character: 'Arthur', profile_path: null },
      { id: 3, name: 'Elliot Page', character: 'Ariadne', profile_path: null },
      { id: 4, name: 'Tom Hardy', character: 'Eames', profile_path: null },
      { id: 5, name: 'Ken Watanabe', character: 'Saito', profile_path: null },
    ],
    crew: [{ id: 10, name: 'Christopher Nolan', job: 'Director' }],
  };
};

// 8. Fetch Movie Videos (Trailers)
export const getMovieVideos = async (movieId) => {
  const data = await fetchTMDB(`/movie/${movieId}/videos`);
  if (data && data.results && data.results.length > 0) return data.results;
  const mockMovie = MOCK_MOVIES.find((m) => m.id === Number(movieId));
  return [
    {
      id: 'vid_1',
      key: mockMovie?.trailer_key || 'YoHD9XEInc0',
      name: 'Official HD Trailer',
      site: 'YouTube',
      type: 'Trailer',
    },
  ];
};

// 9. Fetch Similar Movies
export const getSimilarMovies = async (movieId) => {
  const data = await fetchTMDB(`/movie/${movieId}/similar`);
  if (data && data.results && data.results.length > 0) return data.results;
  return MOCK_MOVIES.filter((m) => m.id !== Number(movieId));
};

// 10. Fetch Genres List
export const getGenres = async () => {
  const data = await fetchTMDB('/genre/movie/list');
  if (data && data.genres) return data.genres;
  return MOCK_GENRES;
};

// 11. Search Movies
export const searchMovies = async (query, page = 1) => {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };
  const data = await fetchTMDB('/search/movie', { query, page });
  if (data && data.results) return data;

  const filtered = MOCK_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.overview.toLowerCase().includes(query.toLowerCase())
  );
  return { results: filtered, total_pages: 1, total_results: filtered.length };
};

// 12. Discover / Filter Movies
export const discoverMovies = async (filters = {}) => {
  const params = {
    page: filters.page || 1,
    with_genres: filters.genre || undefined,
    primary_release_year: filters.year || undefined,
    'vote_average.gte': filters.rating || undefined,
    sort_by: filters.sortBy || 'popularity.desc',
  };

  const data = await fetchTMDB('/discover/movie', params);
  if (data && data.results) return data;
  return { results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
};
