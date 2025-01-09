import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/Components/payment-page/payment-form";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useBooking } from "@/hooks/useBooking";
import { StepsHeader } from "@/Components/page-sections/steps-header";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { useRouter } from "next/router";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISABLE_KEY);

export default function PaymentPage() {
  const router = useRouter();
  const [dots, setDots] = useState("");
  const [isTimeout, setIsTimeout] = useState(false);
  const [total, setTotal] = useState(0);
  const { booking, timeLeft, setTimeLeft } = useBooking();
  const [qrCode, setQrCode] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isExpiredOpen, setIsExpiredOpen] = useState(false);
  const bookingId = booking.booking_id;
  const handleExpiredModal = () => {
    router.push(`/booking/${booking.show_id}`);
  };
  //time remaining
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(prev - 1, 0);
        if (newTime === 0) {
          setIsTimeout(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  //timeout
  useEffect(() => {
    if (isTimeout) {
      setIsExpiredOpen(true);
    }
  }, [isTimeout, router, bookingId]);
  //sse
  useEffect(() => {
    const sse = new EventSource(`/api/payment/sse`);

    sse.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "payment_intent.succeeded") {
        try {
          const response = await axios.patch(
            `/api/payment/qr-code/update-payment`,
            {
              paymentIntent: data.referenceNumber,
              booking_id: bookingId,
              payment_amount: total,
              discount: discountAmount,
              status: "succeeded",
            }
          );
          //console.log("Payment updated successfully");
          const { temp_payment_uuid } = response.data;
          if (temp_payment_uuid) {
            router.push(`/payments/payment-detail/${temp_payment_uuid}`);
          } else {
            console.log("Server error, Please try again later.");
          }
        } catch (error) {
          console.log("Error updating payment");
        }
      } else if (data.status === "payment_intent.payment_failed") {
        try {
          await axios.patch(`/api/payment/qr-code/update-payment`, {
            paymentIntent: data.referenceNumber,
            booking_id: bookingId, // booking_id ปัจจุบัน
            payment_amount: total,
            discount: discountAmount,
            status: "Failed",
          });
          setIsExpiredOpen(true);
        } catch (error) {
          console.log("Error updating payment");
        }
      }
    };
    sse.onerror = (error) => {
      sse.close(); // Close SSE connection if an error occurs
    };
    return () => {
      sse.close(); // Clean up the SSE connection on component unmount
    };
  }, [bookingId, total, discountAmount]);

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
          <p className="text-[#8B93B0] text-sm">
            Time remaining:{" "}
            <span className="text-[#4E7BEE]">{formatTime(timeLeft)}</span>
          </p>
          <QRCodeSVG value={qrCode.qrCodeUrl.data} size={256} />
          <p>Minor Cineplex Public limited company</p>
          <p className="font-bold text-xl">THB{Number(total).toFixed(0)}</p>
        </section>
        {isExpiredOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-[#21263F] border border-[#565F7E] text-white p-4 rounded-lg shadow-lg w-full max-w-xs">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
                onClick={handleExpiredModal}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold text-center">Booking expired</h2>
              <p className="text-sm mt-4 text-center text-[#C8CEDD]">
                You did not complete the checkout process in time, please start
                again.
              </p>
              <button
                className="bg-[#4E7BEE] text-white font-bold px-4 py-2 mt-6 rounded hover:bg-[#1E29A8] w-full"
                onClick={handleExpiredModal}
              >
                OK
              </button>
            </div>
          </div>
        )}
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
            discountAmount={discountAmount}
            setDiscountAmount={setDiscountAmount}
          />
        </section>
      </Elements>
    );
  }
}
