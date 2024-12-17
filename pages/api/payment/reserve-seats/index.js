import connectionPool from "@/utils/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { seatIds, showId, userId, totalPrice, finalPrice } = req.body;

    // const bookingId = uuidv4();
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      //   await connectionPool.query(
      //     `UPDATE booking_seats
      //          SET status = ''
      //          WHERE status = 'Locked' AND lock_expiry <= NOW();`
      //   );

      const seatStatusCheck = await connectionPool.query(
        `SELECT seat_id FROM booking_seats WHERE seat_id = ANY($1) AND status IN ('Locked', 'Booked', 'Cancelled') AND (status != 'Locked' OR lock_expiry > NOW())`,
        [seatIds]
      );

      if (seatStatusCheck.rows.length > 0) {
        throw new Error(
          `Seats are already reserved: ${seatStatusCheck.rows
            .map((row) => row.seat_id)
            .join(", ")}`
        );
      }

      const bookingResult = await connectionPool.query(
        `INSERT INTO bookings (user_id, show_id, total_price, final_price, booking_status, booking_date)
                 VALUES ($1, $2, $3, $4, 'Active', NOW())
                 RETURNING booking_id;`,
        [userId, showId, totalPrice, finalPrice]
      );

      const bookingId = bookingResult.rows[0].booking_id;

      const seatQueries = seatIds.map(async (seatId) => {
        // ตรวจสอบสถานะปัจจุบัน
        const seatCheck = await connectionPool.query(
          `SELECT seat_id, status FROM booking_seats 
           WHERE seat_id = $1 AND status IN ('Locked', 'Booked', 'Cancelled')`,
          [seatId]
        );

        if (seatCheck.rows.length > 0) {
          throw new Error(
            `Seat ${seatId} is already reserved with status: ${seatCheck.rows[0].status}`
          );
        }

        // ถ้าไม่มี conflict ให้เพิ่มข้อมูลใหม่
        return connectionPool.query(
          `INSERT INTO booking_seats (booking_id, seat_id, status, lock_expiry)
           VALUES ($1, $2, 'Locked', NOW() + INTERVAL '15 minutes')
           RETURNING *;`,
          [bookingId, seatId]
        );
      });

      const results = await Promise.all(seatQueries);

      res.status(200).json({
        bookingId,
        bookingDetails: {
          showId,
          userId,
          totalPrice,
          finalPrice,
          bookingStatus: "Active",
          bookingDate: new Date().toISOString(),
        },
        reservedSeats: results.map((r) => ({
          seatId: r.rows[0].seat_id,
          status: r.rows[0].status,
          lockExpiry: r.rows[0].lock_expiry,
        })),
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
