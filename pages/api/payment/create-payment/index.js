export default async function createPendingPayment(req, res) {
  if (req.method === "POST") {
    try {
      const { booking_id, payment_amount, payment_method } = req.body;

      const existingPayment = await connectionPool.query(
        `SELECT * FROM payments WHERE booking_id = $1`,
        [booking_id]
      );

      if (existingPayment.rows.length > 0) {
        return res.status(400).json({
          error: "A payment for this booking already exists.",
        });
      }

      const result = await connectionPool.query(
        `INSERT INTO payments (booking_id, payment_method, payment_status, payment_amount, payment_date)
        VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [booking_id, payment_method, "Pending", payment_amount]
      );

      res.status(201).json({
        message: "Pending payment created.",
        payment: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
