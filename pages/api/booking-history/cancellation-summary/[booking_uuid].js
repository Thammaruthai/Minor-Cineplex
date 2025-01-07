import connectionPool from "@/utils/db";

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
        refunds.refund_amount,
        bookings.total_price,
        bookings.booking_status,
        bookings.booking_date
      FROM bookings
      INNER JOIN users ON users.user_id = bookings.user_id
      INNER JOIN refunds ON refunds.booking_id = bookings.booking_id
      WHERE bookings.temp_booking_uuid = $1
      `;
      let values = [booking_uuid];

      const result = await connectionPool.query(query, values);

      return res.status(200).json({
        data: result.rows[0],
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
