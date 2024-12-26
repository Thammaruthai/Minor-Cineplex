import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/Components/payment-page/payment-form";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { StepsHeader } from "@/Components/page-sections/steps-header";
import { QRCodeSVG } from "qrcode.react";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISABLE_KEY);

export default function PaymentPage() {
  const [total, setTotal] = useState(0);
  const { booking } = useBooking();
  const [qrCode, setQrCode] = useState(null);

  if (
    booking?.booking_status === "Cancelled" ||
    booking?.booking_status === "Paid"
  ) {
    return (
      <section className="flex items-start justify-center gap-24 px-28 py-20 h-full w-full text-white">
        <p>404 This page could not be found</p>
      </section>
    );
  }
  if (qrCode) {
    return (
      <div className="mt-36">
        <section className="bg-[#21263F] text-white mx-auto max-w-4xl py-24 px-8 flex flex-col justify-center items-center gap-5 ">
          <QRCodeSVG value={qrCode} size={256} />
          <p>Minor Cineplex Public limited company</p>
          <p className="font-bold text-xl">THB{total}</p>
        </section>
      </div>
    );
  } else {
    return (
      <Elements stripe={stripePromise}>
        <StepsHeader currentStep={3} />
        <section className="flex flex-col items-end justify-center xl:px-28 lg:px-20 lg:py-11 py-4 h-full w-full">
          <PaymentForm
            total={total}
            setTotal={setTotal}
            qrCode={qrCode}
            setQrCode={setQrCode}
          />
        </section>
      </Elements>
    );
  }
}
