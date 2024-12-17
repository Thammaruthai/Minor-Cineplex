import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { booking_id } = req.body;

    await connectionPool.query(
      `UPDATE bookings SET booking_status = 'Cancelled' WHERE booking_id = $1`,
      [booking_id]
    );
    
    await connectionPool.query(
      `UPDATE booking_seats SET status = 'Cancelled' WHERE booking_id = $1`,
      [booking_id]
    );

    return res.status(200).json({ message: "Booking cancelled successfully." });
  }
}
