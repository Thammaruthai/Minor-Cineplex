import connectionPool from "@/utils/db"; // Import PostgreSQL client connection

export default async function handler(req, res) {
  // Step 1: Check HTTP method
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" }); // Only allow GET requests
  }

  // Step 2: Get cityId from query parameters
  const { cityId } = req.query;

  // Step 3: Validate cityId
  if (!cityId) {
    return res.status(400).json({ error: "Missing required cityId" }); // Return error if cityId is not provided
  }

  const client = await connectionPool.connect();

  try {
    // Step 4: Execute query to fetch cinemas belonging to the given cityId
    const cinemaQuery = `
      SELECT cinema_id, name, address
      FROM cinemas
      WHERE city_id = $1
    `;
    const result = await client.query(cinemaQuery, [cityId]);

    // Step 5: Release client and return the response with the list of cinemas
    client.release();

    return res.status(200).json(result.rows); // Send the list of cinemas back to the client
  } catch (error) {
    // Step 6: Handle any errors and release the client
    client.release();
    console.error("Error fetching cinemas:", error);
    return res.status(500).json({ error: "Internal Server Error" }); // Return a 500 error response
  }
}
