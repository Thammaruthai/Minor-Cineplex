import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, couponCode, totalAmount, bookingId } = req.body;

    if (!userId || !couponCode || !totalAmount || !bookingId) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    try {
      // Validate the coupon
      const result = await connectionPool.query(
        `SELECT
          coupons.coupon_id,
          coupons.discount_amount,
          coupons.discount_type, -- 'Fixed' or 'Percentage'
          coupons.expiration_date,
          coupons.max_uses,
          coupons.is_active,
          coupons.min_purchase_amount,
          (SELECT COUNT(*) FROM coupon_usages WHERE coupon_usages.coupon_id = coupons.coupon_id) AS usage_count
        FROM coupons
        WHERE coupons.code = $1 AND coupons.is_active = TRUE AND 
              (coupons.max_uses IS NULL OR coupons.max_uses > (
                SELECT COUNT(*) FROM coupon_usages WHERE coupon_usages.coupon_id = coupons.coupon_id
              ));`,
        [couponCode]
      );

      if (result.rowCount === 0) {
        return res.status(400).json({ error: "Invalid or expired coupon." });
      }

      const coupon = result.rows[0];

      // Check if total amount meets minimum purchase requirement
      if (totalAmount < coupon.min_purchase_amount) {
        return res.status(400).json({
          error: `Minimum purchase amount is ${coupon.min_purchase_amount}.`,
        });
      }

      // Calculate discount
      const discount =
        coupon.discount_type === "Fixed"
          ? coupon.discount_amount
          : (totalAmount * coupon.discount_amount) / 100;

      const newTotal = totalAmount - discount;

      // Insert usage into coupon_usages
      const usageDate = new Date();

      const insertResult = await connectionPool.query(
        `INSERT INTO coupon_usages (coupon_id, user_id, booking_id, usage_date)
         VALUES ($1, $2, $3, $4) RETURNING usage_id;`,
        [coupon.coupon_id, userId, bookingId, usageDate]
      );

      if (insertResult.rowCount === 0) {
        return res
          .status(500)
          .json({ error: "Failed to record coupon usage." });
      }

      return res.json({
        discount,
        newTotal,
        couponId: coupon.coupon_id,
        usageId: insertResult.rows[0].usage_id,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
