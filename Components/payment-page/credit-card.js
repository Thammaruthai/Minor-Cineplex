import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import { useState } from "react";

export function CreditCard({
  errors,
  setErrors,
  cardOwner,
  handleInputOwner,
}) {
  const [cardBrand, setCardBrand] = useState("unknown");

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

  return (
    <form className="w-[900px] rounded-lg text-white ">
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
              onChange={(event) => {
                handleChange("cardExpiry")(event);
              }}
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
  );
}
