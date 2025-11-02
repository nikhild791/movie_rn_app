export const RAPID_CONFIG = {
  BASE_URL: 'https://moviesdatabase.p.rapidapi.com/titles',
  API_KEY: process.env.EXPO_PUBLIC_RAPID_API_KEY,
  headers: {
    'x-rapidapi-host': process.env.EXPO_PUBLIC_RAPID_HOST,
    'x-rapidapi-key': `${process.env.EXPO_PUBLIC_RAPID_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
}: {
  query: string;
}): Promise<Movie[]> => { 
  const endpoint = query
    ? `${RAPID_CONFIG.BASE_URL}/search/keyword/${encodeURIComponent(query.toLocaleLowerCase())}`
    : `${RAPID_CONFIG.BASE_URL}/random?list=top_rated_series_250`;
    const response = await fetch(endpoint, {
    method: 'GET',
    headers: RAPID_CONFIG.headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("This is search result")
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `https://imdb.iamidiotareyoutoo.com/search?tt=${movieId}`);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
   const endpoint =  `${RAPID_CONFIG.BASE_URL}/x/upcoming`;
    const response = await fetch(endpoint, {
    method: 'GET',
    headers: RAPID_CONFIG.headers,
  });
  if (!response.ok) {
    console.log(response.statusText)
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("this   is trending movies")
  return data.results;
};