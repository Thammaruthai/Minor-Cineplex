import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // ตั้งค่าใน .env

    let event;

    try {

      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // จัดการ event ที่เกี่ยวข้อง
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object; // ข้อมูล payment intent
        console.log("Payment succeeded:", paymentIntent);

        // อัปเดต db
        // ลิ้งไป `/payments/payment-detail/[payment_uuid]`
        break;

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object;
        console.log("Payment failed:", failedIntent);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
