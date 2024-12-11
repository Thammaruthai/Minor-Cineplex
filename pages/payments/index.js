import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/authentication";
// import { useRouter } from "next/router";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISABLE_KEY);

function PaymentForm() {
  // const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [cardOwner, setCardOwner] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if (!state.user) {
    //   router.push({
    //     pathname: "/login",
    //     query: { redirectTo: router.asPath },
    //   });
    //   return; // Stop payment process
    // }

    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }
    setIsLoading(true);

    const { error: createPaymentMethodError, paymentMethod } =
      await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        billing_details: { name: cardOwner },
      });

    if (createPaymentMethodError) {
      console.error("Payment method creation error:", createPaymentMethodError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/payment", {
        amount: 40000,
        currency: "thb",
        paymentMethodId: paymentMethod.id,
        customerName: cardOwner,
        customerEmail: state.user.email,
      });

      const { clientSecret } = response.data;
      //   console.log(`Reponse.DATA`, response.data.data);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (error) {
        console.log("[Payment Error]", error);
      } else {
        if (paymentIntent.status === "succeeded") {
          console.log("[PaymentIntent]", paymentIntent);
        } else {
          console.error("Payment failed with status:", paymentIntent.status);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      CardNumberElement.clear();
      CardExpiryElement.clear();
      CardCvcElement.clear();
      setCardOwner("");
    }
  };
  const handleInputOwner = (e) => setCardOwner(e.target.value);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[793px] mx-auto bg-gray-900 p-6 rounded-lg text-white"
    >
      <div className="flex gap-5">
        <h2 className="text-2xl font-semibold mb-6 ">Credit card</h2>
        <h2 className="text-2xl font-semibold mb-6 text-[#8B93B0]">QR Code</h2>
      </div>
      <div className="mb-4 flex gap-6 w-full">
        <div className="flex flex-col w-full h-full gap-1">
          <label htmlFor="card-number" className="block text-[#C8CEDD]">
            Card number
          </label>
          <div className="w-full bg-[#21263F] rounded-md h-12 flex items-center px-3 border border-[#565F7E]">
            <CardNumberElement
              options={{
                style: {
                  base: {
                    color: "#fff",
                    fontSize: "16px",
                    "::placeholder": {
                      color: "#8B93B0",
                    },
                  },
                },
                placeholder: "Card number",
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="card-number" className="block text-[#C8CEDD]">
            Card owner
          </label>
          <input
            id="card-owner"
            type="text"
            placeholder="Card owner name"
            required
            value={cardOwner}
            onChange={handleInputOwner}
            className="w-full bg-[#21263F] rounded-md h-12 flex items-center px-3 border border-[#565F7E]"
          />
        </div>
      </div>

      {/* Card Details */}
      <div className="mb-4 flex gap-6 w-full">
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="card-number" className="block text-[#C8CEDD]">
            Expiry date
          </label>
          <div className="w-full bg-[#21263F] rounded-md h-12 flex items-center px-3 border border-[#565F7E]">
            <CardExpiryElement
              options={{
                style: {
                  base: {
                    color: "#fff",
                    fontSize: "16px",
                    "::placeholder": {
                      color: "#8B93B0",
                    },
                  },
                },
                placeholder: "MM/YY",
              }}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="card-number" className="block text-[#C8CEDD]">
            CVC
          </label>
          <div className="w-full bg-[#21263F] rounded-md h-12 flex items-center px-3 border border-[#565F7E]">
            <CardCvcElement
              options={{
                style: {
                  base: {
                    color: "#fff",
                    fontSize: "16px",
                    "::placeholder": {
                      color: "#8B93B0",
                    },
                  },
                },
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
          isLoading ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <section className="flex items-center justify-center">
        <PaymentForm />
      </section>
    </Elements>
  );
}
