import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await connectionPool.query(
        `
        SELECT DISTINCT city_name 
        FROM shows
        INNER JOIN halls ON halls.hall_id = shows.hall_id
        INNER JOIN cinemas ON cinemas.cinema_id = halls.cinema_id
        INNER JOIN cities ON cinemas.city_id = cities.city_id
        ORDER BY city_name ASC;
        `
      );
      const cities =
        result.rows.length > 0 ? result.rows.map((row) => row.city_name) : [];
      res.status(200).json({ data: cities });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  }
}
