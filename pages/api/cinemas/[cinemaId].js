import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { cinemaId } = req.query;
    if (!cinemaId) {
      return res.status(400).json({
        error: "Cinema ID is required",
      });
    }
    try {
      let query = `
        SELECT 
          show_id, 
          show_date_time, 
          halls.name AS hall_name, 
          movies.movie_id,
          movies.title, 
          movies.description, 
          movies.release_date, 
          movies.poster, 
          movies.banner, 
          languages.name AS language, 
          cinemas.name AS cinema_name,
          cinemas.poster AS cinema_poster,
          cinemas.banner AS cinema_banner,
          cinemas.description AS cinema_description,
          cinemas.description_2 AS cinema_description2,
          cinemas.address,
          cities.city_name AS city_name,
          ARRAY_AGG(DISTINCT genres.name) AS genres,
          ARRAY_AGG(DISTINCT features.feature_name) AS features
        FROM shows 
        INNER JOIN movies ON movies.movie_id = shows.movie_id
        INNER JOIN movie_genres ON movies.movie_id = movie_genres.movie_id
        INNER JOIN genres ON genres.genre_id = movie_genres.genre_id
        INNER JOIN languages ON movies.language_id = languages.language_id
        INNER JOIN halls ON halls.hall_id = shows.hall_id
        INNER JOIN cinemas ON cinemas.cinema_id = halls.cinema_id
        INNER JOIN cities ON cinemas.city_id = cities.city_id
        LEFT JOIN cinema_features ON cinema_features.cinema_id = cinemas.cinema_id
        LEFT JOIN features ON features.feature_id = cinema_features.feature_id
        WHERE cinemas.cinema_id = $1
      `;
      let values = [cinemaId];

      query += `
      GROUP BY 
        show_id, 
        show_date_time, 
        halls.name,
        movies.movie_id, 
        movies.title, 
        movies.description, 
        movies.release_date, 
        movies.poster, 
        movies.banner, 
        languages.name, 
        cinemas.name,
        cinemas.address, 
        cinemas.poster, 
        cinemas.banner, 
        cinemas.description, 
        cinemas.description_2, 
        cities.city_name
      ORDER BY halls.name ASC, show_date_time ASC;
    `;
      const result = await connectionPool.query(query, values);

      const formattedData = result.rows.map((row) => ({
        movie_name: row.title,
        show_id: row.show_id,
        show_date_time: row.show_date_time,
        hall_name: row.hall_name,
        cinemas: {
          name: row.cinema_name,
          poster: row.cinema_poster,
          banner: row.cinema_banner,
          description: row.cinema_description,
          description2: row.cinema_description2,
          address: row.address,
          feature: row.features,
        },
        city_name: row.city_name,
        movies: {
          movieId: row.movie_id,
          title: row.title,
          description: row.description,
          release_date: row.release_date,
          poster: row.poster,
          banner: row.banner,
          language: row.language,
          genres: row.genres,
        },
      }));

      return res.status(200).json({
        data: formattedData,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}
