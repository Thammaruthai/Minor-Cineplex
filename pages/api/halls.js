import connectionPool from "@/utils/db"; // Import PostgreSQL client connection

export default async function handler(req, res) {
  // Step 1: Check HTTP method
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" }); // Only allow GET requests
  }

  // Step 2: Get cinemaId from query parameters
  const { cinemaId } = req.query;

  // Step 3: Validate cinemaId
  if (!cinemaId) {
    return res.status(400).json({ error: "Missing required cinemaId" }); // Return error if cinemaId is not provided
  }

  const client = await connectionPool.connect();

  try {
    // Step 4: Execute query to fetch halls for the given cinemaId
    const hallsQuery = `
      SELECT hall_id, name, seat_capacity
      FROM halls
      WHERE cinema_id = $1
    `;
    const result = await client.query(hallsQuery, [cinemaId]);

    // Step 5: Release client and return the response with the list of halls
    client.release();

    return res.status(200).json(result.rows); // Send the list of halls back to the client
  } catch (error) {
    // Step 6: Handle any errors and release the client
    client.release();
    console.error("Error fetching halls:", error);
    return res.status(500).json({ error: "Internal Server Error" }); // Return a 500 error response
  }
}
