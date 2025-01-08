import { buffer } from "micro";
import Stripe from "stripe";
import connectionPool from "@/utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      const buf = await buffer(req);
      const sig = req.headers["stripe-signature"];

      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      console.log("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Function to send SSE updates
    const sendSSEUpdate = (data) => {
      if (!global.sseClients) return;
      console.log("Sending SSE update:", data);
      global.sseClients.forEach((client) => {
        try {
          client.write(`data: ${JSON.stringify(data)}\n\n`);
          client.flush();
        } catch (err) {
          console.error("Error sending SSE message", err);
        }
      });
    };

    // Handle the event
    switch (event.type) {
      case "payment_intent.requires_action":
        console.log("PaymentIntent requires action", event.data.object);
        sendSSEUpdate({
          status: "payment_intent.requires_action",
          referenceNumber: event.data.object.id,
        });
        res.json({ status: "requires_action" });
        break;
      case "payment_intent.created":
        console.log("PaymentIntent created:", event.data.object);
        sendSSEUpdate({
          status: "payment_intent.created",
          referenceNumber: event.data.object.id,
        });
        res.json({ status: "created" });
        break;
      case "payment_intent.succeeded":
        console.log("PaymentIntent succeeded:", event.data.object);
        sendSSEUpdate({
          status: "payment_intent.succeeded",
          referenceNumber: event.data.object.id,
        });
        res.json({ status: "succeeded" });
        break;
      case "payment_intent.payment_failed":
        console.log("PaymentIntent failed:", event.data.object);
        sendSSEUpdate({
          status: "payment_intent.payment_failed",
          referenceNumber: event.data.object.id,
        });
        res.json({ status: "failed" });
        break;
      case "charge.succeeded":
        console.log("Charge succeeded:", event.data.object);
        sendSSEUpdate({
          status: "charge.succeeded",
          referenceNumber: event.data.object.id,
        });
        res.json({ status: "succeeded" });
        break;
      case "charge.updated":
        console.log("Charge updated:", event.data.object);
        res.json({ status: "updated" });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
