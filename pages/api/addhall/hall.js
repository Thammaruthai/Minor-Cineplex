// pages/api/add-hall.js
import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { city, cinema, hall } = req.body;

  if (!city || !cinema || !hall) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await connectionPool.query("BEGIN");

    // Insert city if it doesn't exist
    const cityResult = await connectionPool.query(
      "INSERT INTO cities (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING city_id",
      [city]
    );
    const cityId =
      cityResult.rows[0]?.city_id ||
      (
        await connectionPool.query(
          "SELECT city_id FROM cities WHERE name = $1",
          [city]
        )
      ).rows[0].city_id;

    // Insert cinema if it doesn't exist
    const cinemaResult = await connectionPool.query(
      "INSERT INTO cinemas (name, city_id) VALUES ($1, $2) ON CONFLICT (name, city_id) DO NOTHING RETURNING cinema_id",
      [cinema, cityId]
    );
    const cinemaId =
      cinemaResult.rows[0]?.cinema_id ||
      (
        await connectionPool.query(
          "SELECT cinema_id FROM cinemas WHERE name = $1 AND city_id = $2",
          [cinema, cityId]
        )
      ).rows[0].cinema_id;

    // Insert the hall
    await connectionPool.query(
      "INSERT INTO halls (name, cinema_id) VALUES ($1, $2)",
      [hall, cinemaId]
    );

    await connectionPool.query("COMMIT");

    return res.status(201).json({ message: "Hall added successfully!" });
  } catch (error) {
    await connectionPool.query("ROLLBACK");
    console.error("Error adding hall:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
