import Stripe from "stripe";
import connectionPool from "@/utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { amount, booking_id } = req.body;

      const booking = await connectionPool.query(
        `SELECT * FROM bookings WHERE booking_id = $1 AND booking_status = 'Active'`,
        [booking_id]
      );

      if (booking.rows.length === 0) {
        return res.status(400).json({ error: "Booking not found or already expired." });
      }

      // Step 1: Check for existing payments with the same booking_id
      const existingPayment = await connectionPool.query(
        `SELECT * FROM payments WHERE booking_id = $1`,
        [booking_id]
      );

      if (existingPayment.rows.length > 0) {
        return res.status(400).json({
          error: "A payment for this booking already exists.",
          paymentDetails: existingPayment.rows[0],
        });
      }

      // Step 2: Insert a Pending payment record into the database
      const result = await connectionPool.query(
        `INSERT INTO payments 
          (booking_id, payment_method, payment_status, payment_amount, payment_date)
        VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [
          booking_id,
          "card", // Default payment method type
          "Pending", // Initial status
          amount / 100, // Convert satang to Baht
        ]
      );

      const pendingPayment = result.rows[0];

      // Step 3: Return the pending payment details (including temp_payment_uuid)
      return res.status(201).json({
        message: "Pending payment created successfully.",
        paymentDetails: pendingPayment,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  } else if (req.method === "PATCH") {
    try {
      const {
        payment_id,
        paymentMethodId,
        customerName,
        customerEmail,
        currency = "thb",
      } = req.body;

      // Step 1: Retrieve the pending payment
      const payment = await connectionPool.query(
        `SELECT * FROM payments WHERE payment_id = $1`,
        [payment_id]
      );

      if (payment.rows.length === 0) {
        return res.status(404).json({ error: "Payment not found." });
      }

      const { booking_id, payment_amount, temp_payment_uuid } = payment.rows[0];

      // Step 2: Create or retrieve the Stripe customer
      let customer;
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
      } else {
        customer = await stripe.customers.create({
          name: customerName,
          email: customerEmail,
        });
      }

      // Step 3: Attach the payment method if not already attached
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });

      // Step 4: Create and confirm the payment intent
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: payment_amount * 100, // Convert Baht to satang
          currency: currency,
          payment_method_types: ["card"],
          payment_method: paymentMethodId,
          customer: customer.id,
          confirm: true,
        },
        {
          idempotencyKey: `confirm_payment_${booking_id}`,
        }
      );

      console.log(`Payment Intent`, paymentIntent)

      // Step 5: Update the payment status in the database
      await connectionPool.query(
        `UPDATE payments 
         SET payment_status = $1, transaction_reference = $2, payment_date = NOW()
         WHERE payment_id = $3`,
        [paymentIntent.status, paymentIntent.id, payment_id]
      );

      if (paymentIntent.status === "succeeded") {

        await connectionPool.query(
          `UPDATE booking_seats SET status = 'Booked' WHERE booking_id = $1`,
          [booking_id]
        );
      }

      // Step 6: Return the updated payment details
      return res.status(200).json({
        message: "Payment succeeded.",
        paymentDetails: {
          id: payment_id,
          booking_id,
          payment_status: paymentIntent.status,
          transaction_reference: paymentIntent.id,
          uuid: temp_payment_uuid,
        },
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
