// ใช้ require ในการ import connectionPool
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function viewMovie(movieId) {
  try {
    const { data, error } = await supabase
      .from("shows")
      .select(
        `id:show_id, show_date_time, movies (title,banner,poster,description, release_date , language (name)), halls (name, cinemas (name,address,cinema_id, cities (city_name)))`
      )
      .eq("movie_id", movieId)
      .order("show_date_time", { ascending: true });
    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Error fetching data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log("No data found for the given movieId:", movieId);
      return [];
    }

    const sortedData = data.sort((a, b) => {
      const hallNameA = a.halls?.name || "";
      const hallNameB = b.halls?.name || "";
      const dateA = new Date(a.show_date_time);
      const dateB = new Date(b.show_date_time);

      return hallNameA.localeCompare(hallNameB) || dateA - dateB;
    });
    return sortedData.map((show) => ({
      showId: show.id,
      showtime: show.show_date_time,
      movieTitle: show.movies?.title || "Unknown",
      movieLang: show.movies?.language?.name || "Unknown",
      movieReleaseDate: show.movies?.release_date || "Unknown",
      movieDescription: show.movies?.description || "Unknown",
      moviePoster: show.movies?.poster || "Unknown",
      movieBanner: show.movies?.banner || "Unknown",
      hallName: show.halls?.name || "Unknown",
      cinemaName: show.halls?.cinemas?.name || "Unknown",
      cinemaId: show.halls?.cinemas?.cinema_id || "Unknown",
      cinemaAddress: show.halls?.cinemas?.address || "Unknown",
      cityName: show.halls?.cinemas.cities?.city_name || "Unknown",
    }));
  } catch (error) {
    console.log(error);
  }
}

export const fetchFilteredShows = async ({ cinemaName, date }) => {
  try {
    let query = supabase.from("shows").select(
      `
              show_date_time,
              halls (
                name,
                cinemas (
                  name,
                  cities:city_id (city_name)
                )
              )
            `
    );

    if (cinemaName) {
      query = query.ilike("halls.cinemas.name", `%${cinemaName}%`);
    }

    if (date) {
      query = query
        .filter("show_date_time", "gte", `${date} 00:00:00`)
        .filter("show_date_time", "lt", `${date} 23:59:59`);
    }

    const { data, error } = await query;
    console.log(`This from fetch DATA:`, data);
    if (error) {
      console.error("Supabase error:", error);
      return [];
    }
    const filteredData = data.filter((show) => show.halls.cinemas !== null);

    const formattedData = filteredData.map((show) => ({
      showtime: show.show_date_time,
      hallName: show.halls.name || "Unknown Hall",
      cinemaName: show.halls.cinemas.name || "Unknown Cinema",
      cityName: show.halls.cinemas?.cities?.city_name || "Unknown City",
    }));
    console.log("Formatted Data: ", formattedData);
    return formattedData;
  } catch (error) {
    console.log(error);
  }
};

export { supabase };

// import connectionPool from "@/utils/db";

// export async function viewMovie(movieId) {
//   try {
//     const client = await connectionPool.connect();
//     const query = `
//       SELECT
//         s.show_id AS id,
//         s.show_date_time,
//         m.title AS movie_title,
//         m.poster AS movie_poster,
//         m.description AS movie_description,
//         m.release_date AS movie_release_date,
//         l.name AS movie_language,
//         h.name AS hall_name,
//         c.name AS cinema_name,
//         c.cinema_id,
//         c.address AS cinema_address,
//         ct.city_name
//       FROM shows s
//       JOIN movies m ON s.movie_id = m.movie_id
//       LEFT JOIN languages l ON m.language = l.language_id
//       LEFT JOIN halls h ON s.hall_id = h.hall_id
//       LEFT JOIN cinemas c ON h.cinema_id = c.cinema_id
//       LEFT JOIN cities ct ON c.city_id = ct.city_id
//       WHERE s.movie_id = $1
//       ORDER BY s.show_date_time ASC, h.name ASC;
//     `;
//     const { rows } = await client.query(query, [movieId]);

//     if (!rows || rows.length === 0) {
//       console.log("No data found for the given movieId:", movieId);
//       return [];
//     }

//     const sortedData = rows.sort((a, b) => {
//       const hallNameA = a.hall_name || "";
//       const hallNameB = b.hall_name || "";
//       const dateA = new Date(a.show_date_time);
//       const dateB = new Date(b.show_date_time);

//       return hallNameA.localeCompare(hallNameB) || dateA - dateB;
//     });

//     return sortedData.map((show) => ({
//       showId: show.id,
//       showtime: show.show_date_time,
//       movieTitle: show.movie_title || "Unknown",
//       movieLang: show.movie_language || "Unknown",
//       movieReleaseDate: show.movie_release_date || "Unknown",
//       movieDescription: show.movie_description || "Unknown",
//       moviePoster: show.movie_poster || "Unknown",
//       hallName: show.hall_name || "Unknown",
//       cinemaName: show.cinema_name || "Unknown",
//       cinemaId: show.cinema_id || "Unknown",
//       cinemaAddress: show.cinema_address || "Unknown",
//       cityName: show.city_name || "Unknown",
//     }));
//   } catch (error) {
//     console.log(error);
//   }
// }

// export const fetchFilteredShows = async ({ cinemaName, date }) => {
//   try {
//     let query = `
//       SELECT
//         s.show_date_time,
//         h.name AS hall_name,
//         c.name AS cinema_name,
//         ct.city_name
//       FROM shows s
//       JOIN halls h ON s.hall_id = h.hall_id
//       JOIN cinemas c ON h.cinema_id = c.cinema_id
//       LEFT JOIN cities ct ON c.city_id = ct.city_id
//       WHERE 1=1
//     `;
//     if (cinemaName) {
//       query += ` AND c.name ILIKE $1`;
//     }
//     if (date) {
//       query += ` AND s.show_date_time >= $2 AND s.show_date_time < $3`;
//     }
//     const { rows } = await connectionPool.query(query, [
//       cinemaName ? `%${cinemaName}%` : undefined,
//       date ? `${date} 00:00:00` : undefined,
//       date ? `${date} 23:59:59` : undefined,
//     ]);

//     if (!rows || rows.length === 0) {
//       console.log("No data found for the given filters");
//       return [];
//     }

//     const formattedData = rows.map((show) => ({
//       showtime: show.show_date_time,
//       hallName: show.hall_name || "Unknown Hall",
//       cinemaName: show.cinema_name || "Unknown Cinema",
//       cityName: show.city_name || "Unknown City",
//     }));
//     console.log("Formatted Data: ", formattedData);
//     return formattedData;
//   } catch (error) {
//     console.log(error);
//   }
// };
