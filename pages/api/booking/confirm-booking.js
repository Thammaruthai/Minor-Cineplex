import connectionPool from "@/utils/db";
import protect from "@/utils/protect";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  protect(req, res, async () => {
    try {
      // ดึงข้อมูลจาก body
      const { showDetails, booking, price } = req.body;

      const token = req.headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const { userId } = decoded;
      //console.log(userId);
      
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!showDetails || !booking || !userId) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const client = await connectionPool.connect();

      // ตรวจสอบ User
      const userQuery = `
        SELECT * FROM users WHERE user_id = $1;
      `;
      const userResult = await client.query(userQuery, [userId]);
      if (userResult.rows.length === 0) {
        client.release();
        return res.status(404).json({ error: "User not found." });
      }

      const userIdAction = userResult.rows[0];

      // ตรวจสอบที่นั่งซ้ำใน `booking_seats` สำหรับ `show_id` เดียวกัน
      const seatIdsToBook = showDetails.seats
        .filter((seat) =>
          booking.includes(`${seat.seat_row}${seat.seat_number}`)
        )
        .map((seat) => seat.seat_id);

      if (seatIdsToBook.length === 0) {
        client.release();
        return res.status(400).json({ error: "No valid seats selected." });
      }

      const checkDuplicateSeatsQuery = `
        SELECT b.booking_id, b.show_id, bs.seat_id, b.booking_status
      FROM booking_seats bs
      JOIN bookings b ON bs.booking_id = b.booking_id
      WHERE b.show_id = $1 
      AND bs.seat_id = ANY($2::int[]) 
      AND b.booking_status = 'Active';
      `;
      const duplicateSeatsResult = await client.query(
        checkDuplicateSeatsQuery,
        [showDetails.showSummary.show_id, seatIdsToBook]
      );

      //console.log(duplicateSeatsResult.rows);

      if (duplicateSeatsResult.rows.length > 0) {
        client.release();
        return res.status(400).json({
          error:
            "Some seats have already been booked by another user. Please choose different seats.",
        });
      }

      // สร้างการจอง (Booking)
      const createBookingQuery = `
        INSERT INTO bookings (show_id, user_id, booking_status, total_price, final_price,booking_date)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING booking_id, temp_booking_uuid;
      `;
      const bookingResult = await client.query(createBookingQuery, [
        showDetails.showSummary.show_id,
        userIdAction.user_id,
        "Active",
        price,
        price,
      ]);
      const { booking_id, temp_booking_uuid } = bookingResult.rows[0];

      // เพิ่มข้อมูลการจองที่นั่ง (Booking Seats)
      const bookingSeatsQuery = `
        INSERT INTO booking_seats (booking_id, seat_id, status, lock_expiry)
        VALUES ${seatIdsToBook
          .map(
            (_, i) => `($1, $${i + 2}, 'Locked', NOW() + INTERVAL '15 MINUTES')`
          )
          .join(", ")};
      `;
      await client.query(bookingSeatsQuery, [booking_id, ...seatIdsToBook]);

      client.release();

      res.status(200).json({
        success: true,
        message: "Booking confirmed.",
        payment: temp_booking_uuid,
      });
    } catch (error) {
      console.error("Error in confirm-booking API:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
