import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const client = await connectionPool.connect();
    const citiesQuery = "SELECT city_id, city_name FROM cities";
    const result = await client.query(citiesQuery);
    client.release();
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
