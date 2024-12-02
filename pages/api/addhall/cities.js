import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await connectionPool.query(
      "SELECT city_id, city_name FROM cities ORDER BY city_name ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
