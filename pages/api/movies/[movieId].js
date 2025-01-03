import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { movieId } = req.query;
    if (!movieId) {
      return res.status(400).json({
        error: "Movie ID is required",
      });
    }
    try {
      const city = req.query.city || "";
      const cinema = req.query.cinema || "";
      let query = `
        SELECT 
          show_id, 
          show_date_time, 
          halls.name AS hall_name, 
          movies.title, 
          movies.description, 
          movies.release_date, 
          movies.poster, 
          movies.banner, 
          languages.name AS language, 
          cinemas.cinema_id,
          cinemas.name AS cinema_name,
          cinemas.address, 
          cities.city_name AS city_name,
          ARRAY_AGG(genres.name) AS genres,
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
        WHERE shows.movie_id = $1
      `;
      let values = [movieId];
      let paramIndex = 2;

      if (city) {
        query += ` AND cities.city_name = $${paramIndex}`;
        values.push(city);
        paramIndex++;
      }

      if (cinema) {
        query += ` AND cinemas.name ILIKE $${paramIndex}`;
        values.push(`%${cinema}%`);
        paramIndex++;
      }

      query += `
      GROUP BY 
        show_id, 
        show_date_time, 
        halls.name, 
        movies.title, 
        movies.description, 
        movies.release_date, 
        movies.poster, 
        movies.banner, 
        languages.name,
        cinemas.cinema_id, 
        cinemas.name,
        cinemas.address, 
        cities.city_name
      ORDER BY halls.name ASC, show_date_time ASC;
    `;
      const result = await connectionPool.query(query, values);

      const formattedData = result.rows.map((row) => ({
        show_id: row.show_id,
        show_date_time: row.show_date_time,
        hall_name: row.hall_name,
        cinema_id: row.cinema_id,
        cinema_name: row.cinema_name,
        address: row.address,
        city_name: row.city_name,
        cinema_feature: row.features,
        movies: {
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
