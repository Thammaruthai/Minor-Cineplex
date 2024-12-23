import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/router";
import BookingSummary from "./booking-summary";
import ValidateForm from "./validate-form";
import { useBooking } from "@/hooks/useBooking";
import { CreditCard } from "./credit-card";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

function PaymentForm({ total, setTotal }) {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [cardOwner, setCardOwner] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { booking } = useBooking();
  const { userData } = useUser();
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardOwner: "",
    expiryDate: "",
    cvc: "",
    coupon: "",
  });
  const [isValid, setIsValid] = useState(false);
  const { validateCardOwner } = ValidateForm();
  const currentBooking = booking;
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const email = userData.email;
  const [errMsg, setErrMsg] = useState("");
  const [isOpenToastErr, setIsOpenToastErr] = useState(false);
  const [discount, setDiscount] = useState(0);
  const paymentMethod = [
    { id: 1, label: "Credit card" },
    { id: 2, label: "QR Code" },
  ];
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod[0].label);

  const handleMethodSelect = (label) => {
    setSelectedMethod(label);
  };

  const handleTimeout = async () => {
    try {
      // Notify backend to cancel the booking
      await axios.patch("/api/payment/payment-timeout", {
        booking_id: currentBooking.booking_id,
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardOwnerError = validateCardOwner(cardOwner);

    if (cardOwnerError) {
      setErrors({
        cardOwner: cardOwnerError,
      });
      return;
    }

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
      await axios.patch("/api/payment", {
        payment_id: paymentDetails.payment_id,
        currency: "thb",
        paymentMethodId: paymentMethod.id,
        incomingCard: {
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year,
        },
        customerName: cardOwner,
        customerEmail: email,
        discount: discount,
      });

      const payment_uuid = paymentDetails.temp_payment_uuid;

      if (payment_uuid) {
        router.push(`/payments/payment-detail/${payment_uuid}`);
      } else {
        console.error("temp_payment_uuid is missing from API response.");
      }
    } catch (error) {
      console.log(`Error:`, error);
      const errorMessage = error.response?.data?.error;
      setErrMsg(errorMessage);
      setIsOpenToastErr(true);
      toast(
        <div className="w-[300px] md:hidden">
          <strong>Payment failed</strong>
          <p>Please try again</p>
        </div>,
        {
          position: "bottom-center",
          style: {
            borderRadius: "4px",
            color: "white",
            backgroundColor: "#E5364B99",
            display: "block",
            ...(window.innerWidth >= 768 && { display: "none" }),
          },
        }
      );
    } finally {
      setIsLoading(false);
      if (elements) {
        const cardNumberElement = elements.getElement(CardNumberElement);
        const cardExpElement = elements.getElement(CardExpiryElement);
        const cardCvcElement = elements.getElement(CardCvcElement);

        if (cardNumberElement && cardExpElement && cardCvcElement) {
          cardNumberElement.clear();
          cardExpElement.clear();
          cardCvcElement.clear();
        }
      }
      setCardOwner("");
    }
  };

  const handleInputOwner = (e) => {
    setCardOwner(e.target.value);
    setErrors({ ...errors, cardOwner: validateCardOwner(e.target.value) });
  };

  const handleNext = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/payment", {
        amount: total * 100, // Convert to satang
        booking_id: currentBooking.booking_id,
      });

      setPaymentDetails(response.data.paymentDetails);
    } catch (err) {
      console.error(
        "Error creating pending payment:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    const cardNumberElement = elements?.getElement(CardNumberElement);
    const cardExpiryElement = elements?.getElement(CardExpiryElement);
    const cardCvcElement = elements?.getElement(CardCvcElement);

    const allFieldsFilled =
      cardOwner?.trim() &&
      cardNumberElement?._complete &&
      cardExpiryElement?._complete &&
      cardCvcElement?._complete;

    const noErrors =
      !errors.cardNumber &&
      !errors.cardExpiry &&
      !errors.cardCvc &&
      !errors.cardOwner;

    setIsValid(allFieldsFilled && noErrors);
  }, [cardOwner, errors, elements]);

  return (
    <>
      <div className="xl:flex-row flex flex-col lg:gap-24 gap-10 w-full justify-center items-center xl:items-start lg:p-0">
        <div className="w-full xl:w-auto">
          <div className="flex gap-5 p-4 lg:p-0">
            {paymentMethod.map((method) => (
              <h2
                key={method.id}
                onClick={() => handleMethodSelect(method.label)}
                className={`text-2xl font-semibold mb-6 cursor-pointer ${
                  selectedMethod === method.label
                    ? "text-white border-b border-[#565F7E] font-bold"
                    : "text-[#8B93B0] font-bold"
                }`}
              >

                {method.label}
              </h2>
            ))}

          </div>
          {selectedMethod === "Credit card" && (
            <CreditCard
              errors={errors}
              setErrors={setErrors}
              cardOwner={cardOwner}
              handleInputOwner={handleInputOwner}
            />
          )}
          {selectedMethod === "QR Code" && <div>QR Code</div>}
        </div>
        <BookingSummary
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          errors={errors}
          setTotal={setTotal}
          total={total}
          isValid={isValid}
          handleNext={handleNext}
          isTimeout={isTimeout}
          setIsTimeout={setIsTimeout}
          handleTimeout={handleTimeout}
          discount={discount}
          setDiscount={setDiscount}
        />
      </div>
      <Toaster className="md:hidden"/>
      {isOpenToastErr && (
        <div className="bg-[#E5364B99] text-white p-2 px-4 mt-10 lg:mr-28 rounded xl:w-[480px] w-full h-28 flex-col justify-center gap-1 hidden md:flex">
          <div className="flex justify-between">
            <strong>Payment failed.</strong>
            <svg
              onClick={() => setIsOpenToastErr(!isOpenToastErr)}
              style={{ cursor: "pointer" }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
          <span>{errMsg}</span>
          Please try again
        </div>
      )}
    </>
  );
}

export default PaymentForm;
