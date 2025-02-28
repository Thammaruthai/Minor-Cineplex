import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // ใช้ Promise.all เพื่อรัน Query หลายตัวพร้อมกัน

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const safePage = Math.max(1, page);
      const safeLimit = Math.max(1, Math.min(100, limit));
      const offset = (safePage - 1) * safeLimit;

      const [
        moviesResult,
        totalCountResult,
        languagesResult,
        genresResult,
        citiesResult,
      ] = await Promise.all([
        connectionPool.query(
          `
          SELECT 
            m.movie_id,
            m.poster,
            m.title,
            STRING_AGG(DISTINCT g.name, ', ') AS genre_names,
            STRING_AGG(DISTINCT l.name, ', ') AS language_names,
            m.average_rating AS avg_rating,
            m.release_date
          FROM movies m
          LEFT JOIN movie_genres mg ON m.movie_id = mg.movie_id
          LEFT JOIN genres g ON mg.genre_id = g.genre_id
          LEFT JOIN reviews r ON m.movie_id = r.movie_id
          LEFT JOIN languages l ON m.language_id = l.language_id
          GROUP BY m.movie_id
          ORDER BY m.release_date ASC
          LIMIT $1 OFFSET $2;
        `,
          [safeLimit, offset]
        ),
        connectionPool.query(`
          SELECT COUNT(*) AS total_count
          FROM movies;
        `),
        connectionPool.query(`
          SELECT language_id, name
          FROM languages
          ORDER BY name;
        `),
        connectionPool.query(`
          SELECT DISTINCT g.genre_id, g.name
          FROM genres g
          ORDER BY g.name;
        `),
        connectionPool.query(`
          SELECT DISTINCT
            c.city_id,
            c.city_name AS name
          FROM
            cities c
          INNER JOIN cinemas ci ON c.city_id = ci.city_id
          ORDER BY
            c.city_name;
        `),
      ]);

      const totalMovies = parseInt(totalCountResult.rows[0].total_count, 10);
      const totalPages = Math.ceil(totalMovies / safeLimit);

      // ส่ง response เป็น JSON รวมข้อมูลทั้งหมด
      res.status(200).json({
        totalMovies,
        totalPages,
        currentPage: safePage,
        movies: moviesResult.rows,
        languages: languagesResult.rows,
        genres: genresResult.rows,
        cities: citiesResult.rows,
      });
    } catch (error) {
      console.error("Error fetching data:", error.message);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
