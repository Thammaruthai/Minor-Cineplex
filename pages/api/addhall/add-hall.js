import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { city, cinema, hall, seatCapacity, createdBy } = req.body;

  if (!city || !cinema || !hall || !seatCapacity || !createdBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }
console.log(city, cinema, hall, seatCapacity, createdBy);

  const client = await connectionPool.connect();

  // try {
  //   await client.query("BEGIN"); // Start transaction

  //   // Check or insert city
  //   let cityId;
  //   const cityCheckResult = await client.query(
  //     `SELECT city_id FROM cities WHERE city_name = $1`,
  //     [city]
  //   );

  //   console.log(cityCheckResult);
    

  //   if (cityCheckResult.rows.length > 0) {
  //     cityId = cityCheckResult.rows[0].city_id;
  //   } else {
  //     const cityInsertResult = await client.query(
  //       `INSERT INTO cities (city_name, created_by, updated_by, updated_at) 
  //        VALUES ($1, $2, $2, NOW()) 
  //        RETURNING city_id`,
  //       [city, createdBy]
  //     );
  //     cityId = cityInsertResult.rows[0].city_id;
  //   }

  //   // Check or insert cinema
  //   let cinemaId;
  //   const cinemaCheckResult = await client.query(
  //     `SELECT cinema_id FROM cinemas WHERE name = $1 AND city_id = $2`,
  //     [cinema, cityId]
  //   );

  //   console.log(cinemaCheckResult);
    

  //   if (cinemaCheckResult.rows.length > 0) {
  //     cinemaId = cinemaCheckResult.rows[0].cinema_id;
  //   } else {
  //     const cinemaInsertResult = await client.query(
  //       `INSERT INTO cinemas (name, city_id, created_by, updated_by, updated_at) 
  //        VALUES ($1, $2, $3, $3, NOW()) 
  //        RETURNING cinema_id`,
  //       [cinema, cityId, createdBy]
  //     );
  //     cinemaId = cinemaInsertResult.rows[0].cinema_id;
  //   }

  //   // Check if hall already exists
  //   const hallCheckResult = await client.query(
  //     `SELECT hall_id FROM halls WHERE name = $1 AND cinema_id = $2`,
  //     [hall, cinemaId]
  //   );

  //   console.log(hallCheckResult);
    

  //   if (hallCheckResult.rows.length > 0) {
  //     throw new Error("Hall with the same name already exists.");
  //   }

  //   //Insert hall
  //   const hallInsertResult = await client.query(
  //     `INSERT INTO halls (name, cinema_id, seat_capacity, created_by, updated_by, updated_at) 
  //      VALUES ($1, $2, $3, $4, $4, NOW()) 
  //      RETURNING hall_id`,
  //     [hall, cinemaId, seatCapacity, createdBy]
  //   );

  //   if (hallInsertResult.rowCount === 0) {
  //     throw new Error("Failed to add hall");
  //   }

  //   await client.query("COMMIT");
  //   res.status(201).json({ message: "Hall added successfully!" });
  // } catch (error) {
  //   await client.query("ROLLBACK");
  //   console.error("Error adding hall:", error);
  //   res.status(500).json({ error: error.message || "Internal Server Error" });
  // } finally {
  //   client.release();
  // }
}
