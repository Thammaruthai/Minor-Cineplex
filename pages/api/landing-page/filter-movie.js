import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await connectionPool.query (`
        SELECT
    m.movie_id,
    m.title,
    l.name AS language,
    STRING_AGG(g.name, ', ') AS genres,
    COALESCE(AVG(r.rating), 0) AS average_rating -- ดึงค่าเฉลี่ย rating
  FROM
    movies m
  INNER JOIN
    languages l ON m.language_id = l.language_id
  LEFT JOIN
    movie_genres mg ON m.movie_id = mg.movie_id
  LEFT JOIN
    genres g ON mg.genre_id = g.genre_id
  LEFT JOIN
    reviews r ON m.movie_id = r.movie_id -- เชื่อมต่อกับ reviews
  GROUP BY
    m.movie_id, m.title, l.name
  ORDER BY
    m.title
            `);

      const languagesResult = await  connectionPool.query(`
        SELECT language_id, name
        FROM languages
        ORDER BY name
      `);

      const genresResult = await connectionPool.query(`
        SELECT DISTINCT g.genre_id, g.name
        FROM genres g
        ORDER BY g.name
      `);

      const citiesResult = await connectionPool.query(`
        SELECT DISTINCT
          c.city_id,
          c.city_name AS name
        FROM
          cities c
        INNER JOIN cinemas ci ON c.city_id = ci.city_id
        ORDER BY
          c.city_name;
      `);

      res.status(200).json({
        movies: result.rows,
        languages: languagesResult.rows,
        genres: genresResult.rows,
        cities: citiesResult.rows,
      });
    } catch (error) {
      console.error("Error fetching movies and reviews:", error.message);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
