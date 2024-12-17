import connectionPool from "@/utils/db";
import protect from "@/utils/protect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  // ใช้ protect middleware
  protect(req, res, async () => {
    try {
      // ดึงข้อมูลจาก body
      const { showDetails, booking, userUUID, price } = req.body;

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!showDetails || !booking || !userUUID) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // เชื่อมต่อฐานข้อมูล
      const client = await connectionPool.connect();
      const userQuery = `
        SELECT * FROM users WHERE supabase_uuid = $1;
      `;
      const userResult = await client.query(userQuery, [userUUID]);

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found." });
      }

      const userIdAction = userResult.rows[0];
      
      // สร้างการจอง (Booking)
      const createBookingQuery = `
          INSERT INTO bookings (show_id, user_id, booking_status, total_price, final_price )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING booking_id, temp_booking_uuid;
        `;
      const bookingResult = await client.query(createBookingQuery, [
        showDetails.show.show_id,
        userIdAction.user_id,
        "Active",
        price,
        price,
      ]);

      const { booking_id: bookingId, booking_uuid:temp_booking_uuid } =
        bookingResult.rows[0];

      // สร้างการจองที่นั่ง (Booking Seats)
      const seatIdsToBook = showDetails.seats
        .filter((seat) =>
          booking.includes(`${seat.seat_row}${seat.seat_number}`)
        )
        .map((seat) => seat.seat_id);
      

      if (seatIdsToBook.length === 0) {
        client.release();
        return res.status(400).json({ error: "No valid seats selected." });
      }

      const bookingSeatsQuery = `
          INSERT INTO booking_seats (booking_id, seat_id, status, lock_expiry)
          VALUES ${seatIdsToBook
            .map(
              (_, i) =>
                `($1, $${i + 2}, 'Booked', NOW() + INTERVAL '15 MINUTES')`
            )
            .join(", ")};
        `;
      await client.query(bookingSeatsQuery, [bookingId, ...seatIdsToBook]);

      client.release();
      const paymentID = bookingId.temp_booking_uuid;
      console.log(temp_booking_uuid);
      
      res.status(200).json({
        success: true,
        message: "Booking confirmed.",
        payment: paymentID,
      });
    } catch (error) {
      console.error("Error in confirm-booking API:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
