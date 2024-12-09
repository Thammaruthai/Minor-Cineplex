import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { show_Id } = req.query;

  if (!show_Id) {
    return res.status(400).json({ error: "Missing showId parameter" });
  }

  try {
    const client = await connectionPool.connect();

    const showQuery = `
      SELECT * FROM shows WHERE show_id = $1
    `;
    const showResult = await client.query(showQuery, [show_Id]);

    if (showResult.rows.length === 0) {
      return res.status(404).json({ error: "Show not found" });
    }

    const show = showResult.rows[0];

    const movieQuery = `
      SELECT * FROM movies WHERE movie_id = $1
    `;
    const movieResult = await client.query(movieQuery, [show.movie_id]);
    const movie = movieResult.rows[0];

    const hallQuery = `
      SELECT * FROM halls WHERE hall_id = $1
    `;
    const hallResult = await client.query(hallQuery, [show.hall_id]);
    const hall = hallResult.rows[0];

    const seatsQuery = `
      SELECT * FROM seats WHERE hall_id = $1
    `;
    const seatsResult = await client.query(seatsQuery, [show.hall_id]);
    const seats = seatsResult.rows;

    client.release();

    res.status(200).json({ show, movie, hall, seats });
  } catch (error) {
    console.error("Error fetching show details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
