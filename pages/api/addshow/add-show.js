import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { movieId, hallId, showDateTime } = req.body;

  if (!movieId || !hallId || !showDateTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const client = await connectionPool.connect();
    const insertShowQuery = `
      INSERT INTO shows (hall_id, movie_id, show_date_time, created_by, updated_by)
      VALUES ($1, $2, $3, 7, 7)
      RETURNING show_id;
    `;
    const result = await client.query(insertShowQuery, [
      hallId,
      movieId,
      showDateTime,
    ]);
    client.release();
    return res.status(201).json({ message: "Show added successfully!" });
  } catch (error) {
    console.error("Error adding show:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
