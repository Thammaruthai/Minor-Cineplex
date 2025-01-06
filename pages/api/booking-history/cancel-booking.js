import connectionPool from "@/utils/db";
import jwt from "jsonwebtoken";
import protect from "@/utils/protect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        return res.status(404).json({
          error:
            "Booking not found or you don't have permission to cancel this booking.",
        });
      }

      const booking = bookingResult.rows[0];

      // ตรวจสอบว่าการจองนี้สามารถยกเลิกได้หรือไม่ (เช่น สถานะไม่ใช่ "Cancelled" )
      if (booking.booking_status === "Cancelled") {
        client.release();
        return res.status(400).json({ error: "Booking cannot be cancelled." });
      }

      const paymentQuery = `select * from payments where booking_id = $1 and payment_status = 'succeeded'`;
      const paymentResult = await client.query(paymentQuery, [bookingId]);

      if (paymentResult.rows.length === 0) {
        client.release();
        return res.status(400).json({
          error: "Payment for this booking is not completed yet.",
        });
      }

      const paymentIntentId = paymentResult.rows[0].transaction_reference;

      if (!paymentIntentId) {
        client.release();
        return res
          .status(400)
          .json({ error: "Payment Intent ID is missing for this booking." });
      }

      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: booking.final_price * 100, // ใส่จำนวนเงินที่คืน เป็นสตางค์
        reason: "requested_by_customer", // เหตุผลที่คืนเงิน
      });

      console.log(refund);
      

      if (!refund) {
        client.release();
        return res.status(500).json({ error: "Failed to process refund." });
      }

      // อัปเดตสถานะของ booking เป็น "Cancelled" และเพิ่มเหตุผล
      const cancelBookingQuery = `
        UPDATE bookings
        SET booking_status = 'Refund'
        WHERE booking_id = $1;
      `;
      await client.query(cancelBookingQuery, [bookingId]);

      const refundBookingQuery = `
        INSERT INTO refunds (booking_id, refund_amount, refund_status,refund_date, reason)
        VALUES ($1, $2, $3, $4, $5);
      `;

      await client.query(refundBookingQuery, [
        bookingId,
        booking.final_price,
        "Pending",
        new Date(),
        reason,
      ]);

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
