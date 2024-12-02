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
      genres.name AS genre,
      cinemas.name AS cinema_name,
      cinemas.address, 
      cities.city_name AS city_name
      FROM shows 
      INNER JOIN movies on movies.movie_id = shows.movie_id
      INNER JOIN movie_genres on movies.movie_id = movie_genres.movie_id
      INNER JOIN genres on genres.genre_id = movie_genres.genre_id
      INNER JOIN languages on movies.language_id = languages.language_id
      INNER JOIN halls on halls.hall_id = shows.hall_id
      INNER JOIN cinemas on cinemas.cinema_id = halls.cinema_id
      INNER JOIN cities on cinemas.city_id = cities.city_id
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

      query += " ORDER BY halls.name ASC, show_date_time ASC";
      const result = await connectionPool.query(query, values);

      return res.status(200).json({
        movies: result.rows,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}
