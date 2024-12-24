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
    const showSummaryQuery = `
      SELECT    
        movies.title,
        movies.poster,
        ARRAY_AGG(DISTINCT genres.name) AS genres,
        languages.name AS language,
        cinemas.name AS cinema_name,
        shows.show_date_time,
        shows.show_id,
        halls.name AS hall_name,
        shows.hall_id
        FROM shows          
      INNER JOIN movies ON movies.movie_id = shows.movie_id
      INNER JOIN movie_genres ON movies.movie_id = movie_genres.movie_id
      INNER JOIN genres ON genres.genre_id = movie_genres.genre_id
      INNER JOIN languages ON movies.language_id = languages.language_id
      INNER JOIN halls ON halls.hall_id = shows.hall_id
      INNER JOIN cinemas ON cinemas.cinema_id = halls.cinema_id
      WHERE shows.show_id = $1  
      GROUP BY
	  	  movies.title,
        movies.poster,
        languages.name,
        cinemas.name,
        shows.show_date_time,
        shows.show_id,
        halls.name
    `;
    const showSummaryResult = await client.query(showSummaryQuery, [show_Id]);
    const showSummary = showSummaryResult.rows[0];

    // Query 2: Get all seats for the hall
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
    const seatsResult = await client.query(seatsQuery, [showSummary.hall_id]);
    const seats = seatsResult.rows;

    // Query 3: Get booking information for the show
    const bookingsQuery = `
    SELECT 
    bs.seat_id,
    bs.status AS booking_status,
    bs.lock_expiry,
    b.booking_status AS booking_activation
FROM 
    public.booking_seats bs
JOIN 
    public.bookings b ON bs.booking_id = b.booking_id
WHERE 
   b.booking_status != 'Cancelled' and bs.status!='Cancelled' and b.show_id = $1;

    `;
    const bookingsResult = await client.query(bookingsQuery, [show_Id]);
    const bookings = bookingsResult.rows;

    client.release();

    // Combine seat and booking data
    const combinedSeats = seats.map((seat) => {
      const booking = bookings.find((b) => b.seat_id === seat.seat_id);

      return {
        ...seat,
        booking_status:
          booking && booking.booking_activation !== "Cancelled"
            ? booking.booking_status
            : "Available",
        lock_expiry: booking ? booking.lock_expiry : null,
      };
    });

        
    // Include combined seats in the response
    res.status(200).json({ showSummary, seats: combinedSeats });
  } catch (error) {
    console.error("Error fetching show details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
