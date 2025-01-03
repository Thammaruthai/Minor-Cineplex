import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";
import protect from "@/utils/protect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed.` });
  }

  protect(req, res, async () => {
    try {
      // ดึงข้อมูลจาก token เพื่อใช้ในการดึงข้อมูล User
      const token = req.headers.authorization?.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const { userId } = decoded;

      const { bookingId, reason } = req.body;

      if (!bookingId || !reason) {
        return res
          .status(400)
          .json({ error: "Booking ID and reason are required." });
      }

      const client = await connectionPool.connect();

      // ตรวจสอบว่า booking เป็นของ user นี้หรือไม่
      const bookingQuery = `
        SELECT * FROM bookings WHERE booking_id = $1 AND user_id = $2;
      `;
      const bookingResult = await client.query(bookingQuery, [
        bookingId,
        userId,
      ]);

      if (bookingResult.rows.length === 0) {
        client.release();
        return res
          .status(404)
          .json({
            error:
              "Booking not found or you don't have permission to cancel this booking.",
          });
      }

      const booking = bookingResult.rows[0];

      // ตรวจสอบว่าการจองนี้สามารถยกเลิกได้หรือไม่ (เช่น สถานะไม่ใช่ "Cancelled" หรือ "Completed")
      if (
        booking.booking_status === "Cancelled" ||
        booking.booking_status === "Completed"
      ) {
        client.release();
        return res.status(400).json({ error: "Booking cannot be cancelled." });
      }

      // อัปเดตสถานะของ booking เป็น "Cancelled" และเพิ่มเหตุผล
      const cancelBookingQuery = `
        UPDATE bookings
        SET booking_status = 'Cancelled', cancel_reason = $1, cancel_date = NOW()
        WHERE booking_id = $2;
      `;
      await client.query(cancelBookingQuery, [reason, bookingId]);

      client.release();

      return res
        .status(200)
        .json({ success: true, message: "Booking cancelled successfully." });
    } catch (error) {
      console.error("Error in cancel-booking API:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
}
