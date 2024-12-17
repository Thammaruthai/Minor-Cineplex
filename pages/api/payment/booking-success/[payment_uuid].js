import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { payment_uuid } = req.query;
    if (!payment_uuid) {
      return res.status(400).json({
        error: "Payment UUID is required",
      });
    }

    try {
      let query = `
      SELECT
        payments.payment_id,
        payments.temp_payment_uuid,
        users.user_id,
        bookings.booking_id,
        bookings.temp_booking_uuid,
        cinemas.name AS cinema_name,
        shows.show_date_time,
        halls.name AS hall_name,
        ARRAY_AGG(DISTINCT seats.seat_row || seats.seat_number) AS selected_seats, -- Concatenate seat_row and seat_number,
        payments.payment_amount
      FROM payments
      INNER JOIN bookings ON bookings.booking_id = payments.booking_id
      INNER JOIN users ON users.user_id = bookings.user_id
      INNER JOIN booking_seats ON booking_seats.booking_id = bookings.booking_id
      INNER JOIN seats ON seats.seat_id = booking_seats.seat_id
      INNER JOIN shows ON bookings.show_id = shows.show_id
      INNER JOIN halls ON halls.hall_id = shows.hall_id
      INNER JOIN cinemas ON cinemas.cinema_id = halls.cinema_id
      WHERE payments.temp_payment_uuid = $1
      GROUP BY
        users.user_id,
        bookings.booking_id,
        bookings.temp_booking_uuid,
        payments.payment_id,
        payments.temp_payment_uuid,
        cinemas.name,
        shows.show_date_time,
        halls.name,
        payments.payment_amount
      `;
      let values = [payment_uuid];

      const result = await connectionPool.query(query, values);

      return res.status(200).json({
        data: result.rows
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
