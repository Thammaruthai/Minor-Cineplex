import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      const { paymentIntent, booking_id, payment_amount, discount, status } =
        req.body;
      if (
        !paymentIntent ||
        !booking_id ||
        !payment_amount ||
        discount === undefined ||
        !status
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: payment_id, booking_id, payment_amount, discount, or status",
        });
      }

      const result = await connectionPool.query(
        `SELECT payment_id, temp_payment_uuid FROM payments WHERE booking_id = $1`,
        [booking_id]
      );
      const payment = result.rows[0];

      if (!payment) {
        return res
          .status(404)
          .json({ error: "Payment not found for the given booking ID." });
      }

      const { payment_id, temp_payment_uuid } = payment;

      if (status === "succeeded") {
        await connectionPool.query(
          `UPDATE payments 
             SET payment_status = $1, transaction_reference = $2, payment_date = NOW()
             WHERE payment_id = $3`,
          [status, paymentIntent, payment_id]
        );

        await connectionPool.query(
          `UPDATE booking_seats 
           SET status = 'Booked' 
           WHERE booking_id = $1`,
          [booking_id]
        );

        await connectionPool.query(
          `UPDATE bookings 
           SET final_price = $1, discount_applied = $2, booking_status = 'Paid' 
           WHERE booking_id = $3`,
          [payment_amount, discount, booking_id]
        );
      } else if (status === "Failed") {
        await connectionPool.query(
          `UPDATE payments SET payment_status = $1 WHERE payment_id = $2`,
          [status, payment_id]
        );
        await connectionPool.query(
          `UPDATE booking_seats 
             SET status = 'Cancelled' 
             WHERE booking_id = $1`,
          [booking_id]
        );
        await connectionPool.query(
          `UPDATE bookings 
             SET booking_status = 'Cancelled' 
             WHERE booking_id = $1`,
          [booking_id]
        );
      }

      return res.status(200).json({
        message: "Payment and booking updated successfully.",
        temp_payment_uuid: temp_payment_uuid,
      });
    } catch (error) {
      console.log("Error during payment update:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    return res.status(405).json({
      error: "Method not allowed. Use PATCH instead.",
    });
  }
}
