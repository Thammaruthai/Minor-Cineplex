import connectionPool from "@/utils/db"; // Import PostgreSQL client connection

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, language, release_date, description, poster, genres } =
    req.body;

  if (
    !title ||
    !language ||
    !release_date ||
    !description ||
    !poster ||
    !genres
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  console.log(release_date);
  
  const client = await connectionPool.connect();

  try {
    await client.query("BEGIN");

    // Format the release date
    const [day, month, year] = release_date.split("/");
    const formattedDate = `${release_date}`;

    // Check if language exists
    let languageId;
    const languageCheckQuery = `
      SELECT language_id FROM languages WHERE name = $1;
    `;
    const languageCheckResult = await client.query(languageCheckQuery, [
      language,
    ]);

    if (languageCheckResult.rows.length > 0) {
      // Language exists, retrieve the ID
      languageId = languageCheckResult.rows[0].language_id;
    } else {
      // Language doesn't exist, insert it
      const languageInsertQuery = `
        INSERT INTO languages (name)
        VALUES ($1)
        RETURNING language_id;
      `;
      const languageInsertResult = await client.query(languageInsertQuery, [
        language,
      ]);
      languageId = languageInsertResult.rows[0].language_id;
    }

    // Insert the movie
    const movieInsertQuery = `
      INSERT INTO movies (title, language, release_date, description, poster, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, 7, 7)
      RETURNING movie_id;
    `;
    const movieResult = await client.query(movieInsertQuery, [
      title,
      languageId,
      formattedDate,
      description,
      poster,
    ]);

    const movieId = movieResult.rows[0].movie_id;

    // Handle genres
    const genreList = genres.split(",").map((genre) => genre.trim());
    for (const genre of genreList) {
      // Check if the genre exists
      let genreId;
      const genreCheckQuery = `
        SELECT genre_id FROM genres WHERE name = $1;
      `;
      const genreCheckResult = await client.query(genreCheckQuery, [genre]);

      if (genreCheckResult.rows.length > 0) {
        // Genre exists, retrieve the ID
        genreId = genreCheckResult.rows[0].genre_id;
      } else {
        // Genre doesn't exist, insert it
        const genreInsertQuery = `
          INSERT INTO genres (name)
          VALUES ($1)
          RETURNING genre_id;
        `;
        const genreInsertResult = await client.query(genreInsertQuery, [genre]);
        genreId = genreInsertResult.rows[0].genre_id;
      }

      // Insert into movie_genres
      const movieGenreQuery = `
        INSERT INTO movie_genres (movie_id, genre_id)
        VALUES ($1, $2);
      `;
      await client.query(movieGenreQuery, [movieId, genreId]);
    }

    // Insert audit log
    const auditLogQuery = `
      INSERT INTO audit_logs (action, entity_type, entity_id, performed_by)
      VALUES ($1, $2, $3, $4);
    `;
    await client.query(auditLogQuery, [
      "Add Movie",
      "movies",
      movieId,
      7, // Replace with a dynamic user ID if available
    ]);

    await client.query("COMMIT");

    return res.status(201).json({ message: "Movie added successfully!" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding movie:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
}
