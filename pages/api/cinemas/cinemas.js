import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await connectionPool.query(
        `
        SELECT cinema_id, name, address, cities.city_name
        FROM cinemas
        INNER JOIN cities ON cinemas.city_id = cities.city_id
        ORDER BY cinema_id ASC;
        `
      );
      const cinemas =
        result.rows.length > 0
          ? result.rows.map((row) => ({
              cinema_id: row.cinema_id,
              cinema_name: row.name,
              address: row.address,
              city: row.city_name,
            }))
          : [];
      res.status(200).json({ data: cinemas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch cinemas" });
    }
  }
}
