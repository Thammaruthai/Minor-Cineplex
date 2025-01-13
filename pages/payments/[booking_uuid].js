import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/Components/payment-page/payment-form";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useBooking } from "@/hooks/useBooking";
import { StepsHeader } from "@/Components/page-sections/steps-header";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISABLE_KEY);

export default function PaymentPage() {
  const router = useRouter();
  const [dots, setDots] = useState("");
  const [isTimeout, setIsTimeout] = useState(false);
  const [total, setTotal] = useState(0);
  const { booking, timeLeft, isError, setTimeLeft } = useBooking();
  const [qrCode, setQrCode] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isExpiredOpen, setIsExpiredOpen] = useState(false);
  const bookingId = booking.booking_id;
  const [isRequireAction, setIsRequireAction] = useState(false);
  const handleExpiredModal = () => {
    router.push(`/booking/${booking.show_id}`);
  };
  async function handleCheckPaymentStatus(paymentIntentId) {
    try {
      const paymentIntentId = qrCode.paymentIntentId;
      const response = await axios.post("/api/payment/qr-code/check-status", {
        paymentIntentId: paymentIntentId,
      });

      const result = response.data;
      // ตรวจสอบสถานะการชำระเงิน
      if (result.status === "succeeded") {
        try {
          const response = await axios.patch(
            `/api/payment/qr-code/update-payment`,
            {
              paymentIntent: paymentIntentId,
              booking_id: bookingId,
              payment_amount: total,
              discount: discountAmount,
              status: "succeeded",
            }
          );
          const { temp_payment_uuid } = response.data;
          if (temp_payment_uuid) {
            router.push(`/payments/payment-detail/${temp_payment_uuid}`);
          }
        } catch (error) {
          toast.error("Payment error. Please try again later.", {
            position: "bottom-right",
          });
        }
      } else if (result.status === "requires_action") {
        setIsRequireAction(true);
      } else if (result.status === "payment_expired") {
        try {
          await axios.patch(`/api/payment/qr-code/update-payment`, {
            paymentIntent: paymentIntentId,
            booking_id: bookingId,
            payment_amount: total,
            discount: discountAmount,
            status: "Failed",
          });
          setIsExpiredOpen(true);
        } catch (error) {
          toast.error("Payment error. Please try again later.", {
            position: "bottom-right",
          });
        }
      } else {
        toast.error("Payment error. Please try again later.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Payment error. Please try again later.", {
        position: "bottom-right",
      });
    }
  }
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
  /*   useEffect(() => {
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
  }, [bookingId, total, discountAmount]); */

  if (
    booking?.booking_status === "Cancelled" ||
    booking?.booking_status === "Paid" ||
    isError
  ) {
    return (
      <section className="fixed top-0 left-0 flex items-center justify-center h-full w-full text-white">
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-2 justify-center items-center text-xl font-medium">
            <div className="flex justify-center items-center animate-bounce gap-5">
              <Image
                src="/img/404-error.png"
                width={60}
                height={60}
                alt="popcorn"
              />
              <h1 className="text-3xl font-bold">404</h1>
            </div>
            <div className="animate-pulse flex flex-col gap-1 justify-center items-center">
              <p className="text-xl font-medium">
                This page could not be found.
              </p>
              <p className="font-normal">
                You did not complete the checkout process in time, please start
                again.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (qrCode) {
    return (
      <div className="mt-36">
        <Toaster />
        <section className="bg-[#21263F] text-white mx-auto max-w-4xl py-24 px-8 flex flex-col justify-center items-center gap-5 ">
          <p className="text-[#8B93B0] text-sm">
            Time remaining:{" "}
            <span className="text-[#4E7BEE]">{formatTime(timeLeft)}</span>
          </p>
          <QRCodeSVG value={qrCode.qrCodeUrl.data} size={256} />
          <p>Minor Cineplex Public limited company</p>
          <p className="font-bold text-xl">THB{Number(total).toFixed(0)}</p>
          <button
            className="bg-[#4E7BEE] text-white font-bold px-8 py-2 mt-2 rounded hover:bg-[#1E29A8]"
            onClick={handleCheckPaymentStatus}
          >
            Confirm Payment
          </button>
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
        {isRequireAction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-[#21263F] border border-[#565F7E] text-white p-4 rounded-lg shadow-lg w-full max-w-xs">
              <h2 className="text-xl font-bold text-center">
                Complete Your Payment
              </h2>
              <p className="text-sm mt-4 text-center text-[#C8CEDD]">
                Your payment is pending. Please complete the payment within the
                specified time to confirm your booking.
              </p>
              <button
                className="bg-[#4E7BEE] text-white font-bold px-4 py-2 mt-6 rounded hover:bg-[#1E29A8] w-full"
                onClick={() => setIsRequireAction(false)}
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
