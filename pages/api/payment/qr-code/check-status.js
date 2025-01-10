import Stripe from "stripe";
import connectionPool from "@/utils/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentIntentId } = req.body;

  try {
    if (!paymentIntentId) {
      return res.status(400).json({ error: "PaymentIntent ID is required." });
    }

    // ดึงข้อมูล PaymentIntent จาก Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (
      paymentIntent.last_payment_error?.code ===
      "payment_intent_payment_attempt_expired"
    ) {
      res.status(200).json({ status: "payment_expired" });
    }
    // ส่งสถานะกลับไปยัง Client
    res.status(200).json({ status: paymentIntent.status });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Failed to check payment status." });
  }
}
