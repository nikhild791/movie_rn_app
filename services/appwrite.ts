import { Client, TablesDB , ID,  Query } from 'react-native-appwrite';



const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID


const tablesDB  = new TablesDB (client);


// Utility to add a timeout
const withTimeout = async <T>(promise: Promise<T>, ms = 10000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// ✅ Update search count or create a new entry
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await withTimeout(
      tablesDB.listRows({
        databaseId:DATABASE_ID ,
        tableId: TABLE_ID,
        queries: [
          Query.equal("searchTerm", query),
    ]
}),
      8000
    );

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];
      await withTimeout(
        tablesDB.updateRow(DATABASE_ID, TABLE_ID, existingMovie.$id, {
          count: existingMovie.count + 1,
        }),
        8000
      );
    } else {
      await withTimeout(
        tablesDB.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }),
        8000
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

// ✅ Get trending movies
export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await withTimeout(
      tablesDB.listRows(DATABASE_ID, TABLE_ID, [
        Query.limit(5),
        Query.orderDesc("count"),
      ]),
      8000
    );

    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error("getTrendingMovies error:", error);
    throw error;
  }
};
