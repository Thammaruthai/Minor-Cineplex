import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cityName } = req.query;

  if (!cityName) {
    return res.status(400).json({ error: "Missing cityName parameter" });
  }

  try {
    const result = await connectionPool.query(
      `
      SELECT c.cinema_id, c.name
      FROM cinemas c
      INNER JOIN cities ci ON c.city_id = ci.city_id
      WHERE ci.city_name = $1
      ORDER BY c.name ASC
      `,
      [cityName]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching cinemas:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
