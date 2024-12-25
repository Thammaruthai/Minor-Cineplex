import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { amount, currency, email } = req.body;
      console.log(amount);

      if (!email) {
        throw new Error("Missing required param: email");
      }

      const paymentMethod = await stripe.paymentMethods.create({
        type: "promptpay",
        billing_details: { email },
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethod.id,
        confirm: true,
        return_url: "http://localhost:3000/payment-success", // เพิ่ม return_url
      });
      console.log(paymentIntent);

      const qrCodeUrl = paymentIntent.next_action?.promptpay_display_qr_code;

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        qrCodeUrl,
      });
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
