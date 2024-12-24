import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { movie, language, genre, city, date, feature } = req.query || "";

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
        conditions.push(`
          $${conditions.length + 1} = ANY (
            SELECT genres.name 
            FROM genres 
            INNER JOIN movie_genres ON genres.genre_id = movie_genres.genre_id 
            WHERE movie_genres.movie_id = movies.movie_id
          )
        `);
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

      query +=
        conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

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
        show_id: row.show_id,
        show_date_time: row.show_date_time,
        hall_name: row.hall_name,
        cinema_id: row.cinema_id,
        cinema_name: row.cinema_name,
        cinema_feature: row.features,
        address: row.address,
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
        results: formattedData,
      });
    } catch (error) {
      console.error("Error fetching movies and reviews:", error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
