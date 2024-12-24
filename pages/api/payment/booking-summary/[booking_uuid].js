import connectionPool from "@/utils/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { booking_uuid } = req.query;
    if (!booking_uuid) {
      return res.status(400).json({
        error: "Booking ID is required",
      });
    }

    try {
      let query = `
      SELECT
        users.user_id,
        bookings.booking_id,
        bookings.temp_booking_uuid,
        movies.title,
        movies.poster,
        ARRAY_AGG(DISTINCT genres.name) AS genres,
        languages.name AS language,
        cinemas.name AS cinema_name,
        shows.show_date_time,
        shows.show_id,
        halls.name AS hall_name,
        ARRAY_AGG(DISTINCT seats.seat_row || seats.seat_number) AS selected_seats, -- Concatenate seat_row and seat_number,
        bookings.total_price,
        bookings.booking_status,
        bookings.booking_date
      FROM bookings
      INNER JOIN users ON users.user_id = bookings.user_id
      INNER JOIN booking_seats ON booking_seats.booking_id = bookings.booking_id
      INNER JOIN seats ON seats.seat_id = booking_seats.seat_id
      INNER JOIN shows ON bookings.show_id = shows.show_id
      INNER JOIN movies ON movies.movie_id = shows.movie_id
      INNER JOIN movie_genres ON movies.movie_id = movie_genres.movie_id
      INNER JOIN genres ON genres.genre_id = movie_genres.genre_id
      INNER JOIN languages ON movies.language_id = languages.language_id
      INNER JOIN halls ON halls.hall_id = shows.hall_id
      INNER JOIN cinemas ON cinemas.cinema_id = halls.cinema_id
      WHERE bookings.temp_booking_uuid = $1
      GROUP BY
        users.user_id,
        bookings.booking_id,
        bookings.temp_booking_uuid,
        movies.title,
        movies.poster,
        languages.name,
        cinemas.name,
        shows.show_date_time,
        shows.show_id,
        halls.name,
        bookings.total_price,
        bookings.booking_status,
        bookings.booking_date
      `;
      let values = [booking_uuid];

      const result = await connectionPool.query(query, values);

      const rawBookingDate = result.rows[0].booking_date;

      const bookingDate = dayjs.utc(rawBookingDate); // Use as is for now
      const currentTime = dayjs.utc();

      const elapsedSeconds = currentTime.diff(bookingDate, "second");
      const remainingTime = Math.max(0, 15 * 60 - elapsedSeconds);

      return res.status(200).json({
        data: result.rows[0],
        remaining_time: remainingTime,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
