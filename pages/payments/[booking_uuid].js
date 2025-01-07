import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/Components/payment-page/payment-form";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useBooking } from "@/hooks/useBooking";
import { StepsHeader } from "@/Components/page-sections/steps-header";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISABLE_KEY);

export default function PaymentPage() {
  const router = useRouter();
  const [dots, setDots] = useState("");
  const [isTimeout, setIsTimeout] = useState(false);
  const [total, setTotal] = useState(0);
  const { booking, timeLeft, setTimeLeft } = useBooking();
  const [qrCode, setQrCode] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const bookingId = booking.booking_id;
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
      router.push(`/booking/${booking.show_id}`);
    }
  }, [isTimeout, router, bookingId]);
  //sse
  useEffect(() => {
    const sse = new EventSource(`/api/payment/sse`);

    sse.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("SSE Message:", data);
      setPaymentStatus(data.status); // Update payment status from SSE response

      if (data.status === "payment_intent.succeeded") {
        try {
          console.log("id inside", total, discountAmount);

          const response = await axios.patch(
            `/api/payment/qr-code/update-payment`,
            {
              paymentIntent: data.referenceNumber,
              booking_id: bookingId, // booking_id ปัจจุบัน
              payment_amount: total,
              discount: discountAmount,
              status: "succeeded",
            }
          );
          console.log("Payment updated successfully");
          const { temp_payment_uuid } = response.data; // Get temp_payment_uuid from the response
          if (temp_payment_uuid) {
            router.push(`/payments/payment-detail/${temp_payment_uuid}`); // Redirect using temp_payment_uuid
          } else {
            console.error("temp_payment_uuid is missing.");
          }
        } catch (error) {
          console.log("Error updating payment:", error);
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
          toast(
            <strong>
              Payment Failed. Please try again or book your seat again.
            </strong>,
            {
              position:
                window.innerWidth <= 1024 ? "bottom-center" : "bottom-right", // ถ้าหน้าจอเล็กกว่า 1024px จะให้ toast อยู่กลางล่าง
              style: {
                borderRadius: "4px",
                backgroundColor: "#E5364B99",
                color: "white",
              },
            }
          );

          router.push(`/booking/${booking.show_id}`);
        } catch (error) {}
      }
    };
    sse.onerror = (error) => {
      console.error("SSE Error:", error);
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
        <Toaster />
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
