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
    : `${RAPID_CONFIG.BASE_URL}`;
  console.log("This is query",endpoint)
    const response = await fetch(endpoint, {
    method: 'GET',
    headers: RAPID_CONFIG.headers,
  });
  if (!response.ok) {
    console.log(response.statusText)
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("This is search result",data.results)
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