import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function viewMovie(movieId) {
  try {
    const { data, error } = await supabase
      .from("shows")
      .select(
        `id:show_id, show_date_time, movies (title,poster,description, release_date , language (name)), halls (name, cinemas (name,address,cinema_id, cities (city_name)))`
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

export const fetchFilteredShows = async ({ cinemaName }) => {
  try {
    const query = supabase.from("shows").select(
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
      query.ilike("halls.cinemas.name", `%${cinemaName}%`);
    }

    const { data, error } = await query;

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

    return formattedData;
  } catch (error) {
    console.log(error);
  }
};

export { supabase };
