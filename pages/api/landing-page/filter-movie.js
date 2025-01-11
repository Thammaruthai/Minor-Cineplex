import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { movie, language, genre, city, date, feature } = req.query || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 3;
      const safePage = Math.max(1, page);
      const safeLimit = Math.max(1, Math.min(100, limit));
      const offset = (safePage - 1) * safeLimit;

      let query = `
        SELECT
          cinemas.cinema_id, 
          cinemas.name AS cinema_name,
          cinemas.address,
          cinemas.poster AS cinema_poster,
          cinemas.banner AS cinema_banner,
          cinemas.description AS cinema_description,
          cinemas.description_2 AS cinema_description2,
          cities.city_name,
          shows.show_date_time,
          ARRAY_AGG(DISTINCT features.feature_name) AS cinema_features,
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'hall_id', halls.hall_id,
              'hall_name', halls.name,
              'showtimes', (
                SELECT JSON_AGG(
                  JSONB_BUILD_OBJECT(
                    'show_id', shows.show_id,
                    'show_date_time', shows.show_date_time,
                    'movie_id', movies.movie_id,
                    'title', movies.title,
                    'description', movies.description,
                    'release_date', movies.release_date,
                    'poster', movies.poster,
                    'banner', movies.banner,
                    'language', languages.name,
                    'cinema_name', cinemas.name,
                    'hall_name', halls.name,
                    'hall_id', halls.hall_id,
                    'genres', (
                      SELECT ARRAY_AGG(DISTINCT genres.name)
                      FROM genres
                      INNER JOIN movie_genres 
                        ON genres.genre_id = movie_genres.genre_id
                      WHERE movie_genres.movie_id = movies.movie_id
                    )
                  )
                  ORDER BY shows.show_date_time
                )
                FROM shows
                WHERE shows.hall_id = halls.hall_id
              )
            )
          ) AS halls
        FROM cinemas
        INNER JOIN halls ON halls.cinema_id = cinemas.cinema_id
        INNER JOIN shows ON shows.hall_id = halls.hall_id
        INNER JOIN movies ON movies.movie_id = shows.movie_id
        INNER JOIN languages ON languages.language_id = movies.language_id
        INNER JOIN cities ON cinemas.city_id = cities.city_id
        LEFT JOIN cinema_features ON cinema_features.cinema_id = cinemas.cinema_id
        LEFT JOIN features ON features.feature_id = cinema_features.feature_id
      `;

      let countQuery = `
        SELECT COUNT(DISTINCT cinemas.cinema_id) AS total_cinemas
        FROM cinemas
        INNER JOIN halls ON halls.cinema_id = cinemas.cinema_id
        INNER JOIN shows ON shows.hall_id = halls.hall_id
        INNER JOIN movies ON movies.movie_id = shows.movie_id
        INNER JOIN languages ON languages.language_id = movies.language_id
        INNER JOIN cities ON cinemas.city_id = cities.city_id
        LEFT JOIN cinema_features ON cinema_features.cinema_id = cinemas.cinema_id
        LEFT JOIN features ON features.feature_id = cinema_features.feature_id
      `;

      const conditions = [];
      const values = [];

      if (movie) {
        conditions.push(`movies.title ILIKE $${conditions.length + 1}`);
        values.push(`%${movie}%`);
      }

      if (language) {
        conditions.push(`languages.name ILIKE $${conditions.length + 1}`);
        values.push(`%${language}%`);
      }

      if (genre) {
        conditions.push(`$${conditions.length + 1} = ANY(
          SELECT genres.name 
          FROM genres 
          INNER JOIN movie_genres 
            ON genres.genre_id = movie_genres.genre_id
          WHERE movie_genres.movie_id = movies.movie_id
        )`);
        values.push(genre);
      }

      if (city) {
        conditions.push(`cities.city_name ILIKE $${conditions.length + 1}`);
        values.push(`%${city}%`);
      }

      if (date) {
        conditions.push(
          `DATE(shows.show_date_time) = $${conditions.length + 1}`
        );
        values.push(date);
      }

      if (feature) {
        const featureArray = Array.isArray(feature) ? feature : [feature];
        conditions.push(`
          (
            SELECT COUNT(*)
            FROM cinema_features cf
            INNER JOIN features f ON cf.feature_id = f.feature_id
            WHERE cf.cinema_id = cinemas.cinema_id
            AND f.feature_name = ANY($${conditions.length + 1}::TEXT[])
          ) = $${conditions.length + 2}
        `);
        values.push(featureArray, featureArray.length);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
        countQuery += " WHERE " + conditions.join(" AND ");
      }

      query += `
      GROUP BY cinemas.cinema_id, cities.city_name, shows.show_date_time
      ORDER BY cinemas.cinema_id ASC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2};
      `;

      const countValues = [...values];
      values.push(safeLimit, offset);

      const countResult = await connectionPool.query(countQuery, countValues);
      const result = await connectionPool.query(query, values);

      const totalCinemas = parseInt(countResult.rows[0].total_cinemas, 10);
      const totalPages = Math.ceil(totalCinemas / safeLimit);

      const formattedData = result.rows.map((row) => ({
        cinema_id: row.cinema_id,
        cinema_name: row.cinema_name,
        address: row.address,
        city_name: row.city_name,
        cinema_poster: row.cinema_poster,
        cinema_banner: row.cinema_banner,
        cinema_description: row.cinema_description,
        cinema_features: row.cinema_features,
        show_date_time: row.show_date_time,
        halls: row.halls,
      }));

      return res.status(200).json({
        currentPage: safePage,
        totalPages,
        totalItems: totalCinemas,
        results: formattedData,
      });
    } catch (error) {
      console.error("Error fetching cinemas:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
