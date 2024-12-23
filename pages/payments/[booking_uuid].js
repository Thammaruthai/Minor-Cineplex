import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/Components/payment-page/payment-form";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { StepsHeader } from "@/Components/page-sections/steps-header";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISABLE_KEY);

export default function PaymentPage() {
  const [total, setTotal] = useState(0);
  const { booking } = useBooking();

  if (booking?.booking_status === "Cancelled" || booking?.booking_status === "Paid") {
    return (
      <section className="flex items-start justify-center gap-24 px-28 py-20 h-full w-full text-white">
        <p>404 This page could not be found</p>
      </section>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StepsHeader currentStep={3}/>
      <section className="flex flex-col items-end justify-center xl:px-28 lg:px-20 lg:py-11 py-4 h-full w-full">
        <PaymentForm total={total} setTotal={setTotal} />
      </section>
    </Elements>
  );
}
