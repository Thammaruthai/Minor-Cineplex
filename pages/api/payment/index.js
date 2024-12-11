import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        amount,
        currency = "thb",
        paymentMethodId,
        customerName,
        customerEmail,
      } = req.body;

      let customer;

      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]; // Use the existing customer
        console.log("Existing customer found:", customer);

        // Check if the payment method is already attached
        const attachedPaymentMethods = await stripe.paymentMethods.list({
          customer: customer.id,
          type: "card",
        });

        const isPaymentMethodAttached = attachedPaymentMethods.data.some(
          (method) => method.id === paymentMethodId
        );

        if (!isPaymentMethodAttached) {
          // Attach the new payment method
          await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customer.id,
          });

          await stripe.customers.update(customer.id, {
            invoice_settings: {
              default_payment_method: paymentMethodId,
            },
          });
        }
      } else {
        customer = await stripe.customers.create({
          name: customerName,
          email: customerEmail,
        });
        console.log("New customer created:", customer);

        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customer.id,
        });

        await stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      console.log("Customer Created:", customer);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method_types: ["card"], 
        payment_method: paymentMethodId,
        customer: customer.id,
        confirm: false,
      });

      console.log("PaymentIntent Created:", paymentIntent);

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        customer: { customerId: customer.id, customerName: customer.name },
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
