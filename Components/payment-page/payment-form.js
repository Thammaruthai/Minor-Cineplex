import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/router";
import Image from "next/image";
import BookingSummary from "./booking-summary";
import ValidateForm from "./validate-form";
import { useBooking } from "@/hooks/useBooking";

function PaymentForm({ total, setTotal }) {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [cardOwner, setCardOwner] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [expDate, setExpDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const { booking } = useBooking();
  const datePickerRef = useRef();
  const { userData, fetchUserProfile } = useUser();
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardOwner: "",
    expiryDate: "",
    cvc: "",
  });
  const [isValid, setIsValid] = useState(false);
  const { validateCardOwner, validateExpiryDate } = ValidateForm();
  const currentBooking = booking;
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const email = userData.email;
  const [cardBrand, setCardBrand] = useState("unknown");
  const [errMsg, setErrMsg] = useState("");
  const [isOpenToastErr, setIsOpenToastErr] = useState(false);

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
        customerName: cardOwner,
        customerEmail: email,
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

  const handleDateChange = (date) => {
    setExpDate(date);
    setErrors({ ...errors, expiryDate: validateExpiryDate(date) });
    setIsDatePickerOpen(false); // Close the date picker after selection
  };

  const handleIconClick = () => {
    setIsDatePickerOpen((prev) => !prev); // Toggle the date picker
  };

  const handleChange = (type) => (event) => {
    if (event.error) {
      setErrors((prev) => ({
        ...prev,
        [type]: event.error.message,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [type]: "",
      }));
    }
  };

  const handleCardBrand = (event) => {
    if (event.brand) {
      setCardBrand(event.brand); // Update card brand
    } else {
      setCardBrand("unknown"); // Fallback for unknown brand
    }
  };

  const handleNext = async () => {
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
    // fetchUserProfile();
  }, [cardOwner, errors, elements]);

  return (
    <>
      <div className="flex gap-24 w-full justify-center">
        <form className="w-[900px] px-6 rounded-lg text-white ">
          <div className="flex gap-5">
            <h2 className="text-2xl font-semibold mb-6 border-b border-[#565F7E]">
              Credit card
            </h2>
            <h2 className="text-2xl font-semibold mb-6 text-[#8B93B0]">
              QR Code
            </h2>
          </div>
          <div className="mb-4 flex gap-6 w-full">
            <div className="flex flex-col w-full h-full gap-1">
              <label htmlFor="card-number" className="block text-[#C8CEDD]">
                Card number
              </label>
              <div
                className={`w-full bg-[#21263F] rounded-md h-12 flex items-center px-3 ${
                  errors.cardNumber
                    ? "border border-red-500"
                    : "border border-[#565F7E]"
                } border border-[#565F7E]`}
              >
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
                      invalid: {
                        color: "#fff", // Color for invalid input
                      },
                    },
                    placeholder: "Card number",
                  }}
                  onChange={(event) => {
                    handleChange("cardNumber")(event);
                    handleCardBrand(event);
                  }}
                  className="w-full"
                />
                <Image
                  src={`/img/brand/${cardBrand}.png`}
                  alt={cardBrand}
                  width={32}
                  height={32}
                  className=""
                />
              </div>
              {errors.cardNumber && (
                <p className="error-text text-red-500 text-sm mt-1">
                  Card number is not valid
                </p>
              )}
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
                className={`w-full bg-[#21263F] rounded-md h-12 flex items-center px-3 ${
                  errors.cardOwner
                    ? "border border-red-500 text-white"
                    : "border border-[#565F7E]"
                } border border-[#565F7E]`}
              />
              {errors.cardOwner && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.cardOwner}
                </span>
              )}
            </div>
          </div>

          {/* Card Details */}
          <div className="mb-4 flex gap-6 w-full">
            <div className="flex flex-col w-full gap-1 ">
              <label htmlFor="card-number" className="block text-[#C8CEDD]">
                Expiry date
              </label>
              <div
                className={`w-full relative bg-[#21263F] rounded-md h-12 flex items-center px-3 ${
                  errors.cardExpiry
                    ? "border border-red-500 text-white"
                    : "border border-[#565F7E]"
                } border border-[#565F7E]`}
              >
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
                      invalid: {
                        color: "#fff", // Color for invalid input
                      },
                    },
                    placeholder: "MM/YY",
                  }}
                  onChange={(event) => handleChange(event, "cardExpiry")}
                  className="w-full"
                />
              </div>
              {errors.cardExpiry && (
                <p className="error-text text-red-500 text-sm mt-1">
                  Expiry is not valid
                </p>
              )}
            </div>
            <div className="flex flex-col w-full gap-1">
              <label htmlFor="card-number" className="block text-[#C8CEDD]">
                CVC
              </label>
              <div
                className={`w-full bg-[#21263F] rounded-md h-12 flex items-center px-3 ${
                  errors.cardCvc
                    ? "border border-red-500 text-white"
                    : "border border-[#565F7E]"
                } border border-[#565F7E]`}
              >
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
                      invalid: {
                        color: "#fff", // Color for invalid input
                      },
                    },
                  }}
                  onChange={handleChange("cardCvc")}
                  className="w-full"
                />
              </div>
              {errors.cardCvc && (
                <p className="error-text text-red-500 text-sm mt-1">
                  CVC is not valid
                </p>
              )}
            </div>
          </div>
        </form>
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
        />
      </div>
      {isOpenToastErr && (
        <div className="bg-[#E5364B99] text-white p-2 px-4 mt-10 mr-28 rounded w-[480px] h-28 flex flex-col justify-center gap-1">
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
