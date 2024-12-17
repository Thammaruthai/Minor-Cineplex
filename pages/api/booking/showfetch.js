import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { show_Id } = req.query;

  if (!show_Id) {
    return res.status(400).json({ error: "Missing showId parameter" });
  }

  try {
    const client = await connectionPool.connect();

    // Query 1: Get show details
    const showQuery = `
      SELECT * FROM shows WHERE show_id = $1
    `;
    const showResult = await client.query(showQuery, [show_Id]);

    if (showResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Show not found" });
    }

    const show = showResult.rows[0];

    // Query 2: Get movie details
    const movieQuery = `
      SELECT * FROM movies WHERE movie_id = $1
    `;
    const movieResult = await client.query(movieQuery, [show.movie_id]);
    const movie = movieResult.rows[0];

    // Query 3: Get hall details
    const hallQuery = `
      SELECT * FROM halls WHERE hall_id = $1
    `;
    const hallResult = await client.query(hallQuery, [show.hall_id]);
    const hall = hallResult.rows[0];

    // Query 4: Get all seats for the hall
    const seatsQuery = `
      SELECT 
          s.seat_id,
          s.seat_row,
          s.seat_number
      FROM 
          public.seats s
      WHERE 
          s.hall_id = $1
      ORDER BY 
          s.seat_row ASC, s.seat_number ASC;
    `;
    const seatsResult = await client.query(seatsQuery, [show.hall_id]);
    const seats = seatsResult.rows;

    // Query 5: Get booking information for the show
    const bookingsQuery = `
      SELECT 
          bs.seat_id,
          bs.status AS booking_status,
          bs.lock_expiry
      FROM 
          public.booking_seats bs
      JOIN 
          public.bookings b ON bs.booking_id = b.booking_id
      WHERE 
          b.show_id = $1;
    `;
    const bookingsResult = await client.query(bookingsQuery, [show_Id]);
    const bookings = bookingsResult.rows;

    client.release();

    // Combine seat and booking data
    const combinedSeats = seats.map((seat) => {
      const booking = bookings.find((b) => b.seat_id === seat.seat_id);
      return {
        ...seat,
        booking_status: booking ? booking.booking_status : "Available",
        lock_expiry: booking ? booking.lock_expiry : null,
      };
    });

    // Include combined seats in the response
    res.status(200).json({ show, movie, hall, seats: combinedSeats });
  } catch (error) {
    console.error("Error fetching show details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
