import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  if (req.method === "POST") {
    try {
    } catch (error) {}
  }
}
