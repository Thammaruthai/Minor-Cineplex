import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await connectionPool.connect();
    const moviesQuery = "SELECT movie_id, title FROM movies";
    const result = await client.query(moviesQuery);
    client.release();
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching movies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
