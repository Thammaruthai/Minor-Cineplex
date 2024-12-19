import React, { useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import { useBooking } from "@/hooks/useBooking";
import { formatedDate, formatShowtime } from "@/utils/date";
import { useState } from "react";
import { useDialog } from "@/hooks/useDialog";
import { debounce } from "lodash";
import { ConfirmDialog, ExpiredDialog } from "./open-dialog";

function BookingSummary({
  handleSubmit,
  handleTimeout,
  handleNext,
  isLoading,
  errors,
  setTotal,
  total,
  isValid,
  isTimeout,
  setIsTimeout,
}) {
  const { booking, timeLeft, setTimeLeft } = useBooking();
  const currentBooking = booking;
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const { isDialogOpen, openDialog, closeDialog } = useDialog();

  useEffect(() => {
    if (currentBooking) {
      setTotal(currentBooking.total_price);
    }
  }, [currentBooking]);

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const debouncedValidateCoupon = debounce(async (code) => {
    if (!code.trim()) return; // Avoid empty requests
    try {
      const response = await axios.post(
        "/api/payment/booking-summary/validate-coupon",
        {
          userId: currentBooking.user_id,
          couponCode: code,
          totalAmount: currentBooking.total_price,
          bookingId: currentBooking.booking_id,
        }
      );

      setDiscount(response.data.discount);
      setTotal(response.data.newTotal);
      setError("");
    } catch (err) {
      console.error(
        "Coupon validation error:",
        err.response?.data || err.message
      );
      setDiscount(0);
      setTotal(currentBooking.total_price);
      setError(err.response?.data?.error || "Invalid coupon code.");
    }
  }, 500);

  const handleCouponInput = (e) => {
    const code = e.target.value;
    setCouponCode(code);
    if (code.trim()) {
      debouncedValidateCoupon(code.trim());
    } else {
      // Reset state if input is cleared
      setDiscount(0);
      setTotal(currentBooking.total_price);
      setError("");
    }
  };

  const sortSeats = (seats) => {
    if (!Array.isArray(seats)) return "";
    return seats
      .sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true });
      })
      .join(", ");
  };

  if (!currentBooking) {
    return null;
  }

  if (isTimeout) {
    handleTimeout();
  }

  return (
      <article className="w-[350px] h-[650px] rounded-lg text-[#8B93B0] bg-[#070C1B] px-4 pt-4 pb-6 gap-6 flex flex-col">
        <div className="flex flex-col h-[336px] w-full gap-6 ">
          <div className="flex flex-col h-full gap-3">
            <div className="text-sm">
              <p>
                Time remaining:
                <span className="text-[#4E7BEE]">
                  {isTimeout ? " 00:00" : ` ${formatTime(timeLeft)}`}
                </span>
              </p>
            </div>
            <div className="flex h-full w-full gap-4 items-center">
              <Image
                src={currentBooking?.poster}
                alt="Dark Knight"
                width={100}
                height={120}
                className=""
              />
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-white text-xl font-bold">
                    {currentBooking?.title}
                  </h3>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {currentBooking?.genres?.map((genre, index) => (
                    <Button
                      key={index}
                      className="bg-[#21263F] rounded-md text-sm w-[65px]"
                    >
                      {genre.trim()}
                    </Button>
                  ))}
                  <Button className="bg-[#21263F] rounded-md text-sm w-12">
                    {currentBooking?.language}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-[#C8CEDD]">
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Pin_fill.png"
                width={0}
                height={0}
                alt="Pin icon"
                className="w-4 h-4"
              />
              <p>{currentBooking?.cinema_name}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Date_range_fill.png"
                width={0}
                height={0}
                alt="Calendar icon"
                className="w-4 h-4"
              />
              <p>{formatedDate(currentBooking?.show_date_time)}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Time_fill.png"
                width={0}
                height={0}
                alt="Time Icon"
                className="w-4 h-4"
              />
              <p>{formatShowtime(currentBooking?.show_date_time)}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Shop.png"
                width={0}
                height={0}
                alt="Shop icon"
                className="w-4 h-4"
              />
              <p>{currentBooking?.hall_name}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 border-t border-[#21263F] pt-4 pb-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p>Selected Seat</p>
              <div className="flex">
                <p className="text-white font-bold">
                  {currentBooking?.selected_seats &&
                    sortSeats(currentBooking.selected_seats)}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <p>Payment method</p>
              <p className="text-white font-bold">Credit card</p>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <p>Coupon</p>
                <p className="text-red-500 font-bold">
                  -THB{Math.round(discount)}
                </p>
              </div>
            )}
            <div className="flex justify-between">
              <p>Total</p>
              <p className="text-white font-bold">THB{Math.round(total)}</p>
            </div>
          </div>
          <input
            placeholder="Coupon"
            disabled={!isValid || isLoading}
            value={couponCode}
            onChange={handleCouponInput}
            className="bg-[#21263F] pl-4 p-3 rounded-md border border-[#565F7E]"
          ></input>
          <Button
            type="button"
            disabled={!isValid || isLoading}
            onClick={() => {
              if (isTimeout) {
                handleTimeout();
                openDialog();
              } else {
                handleNext();
                openDialog();
              }
            }}
            className={`bg-[#4E7BEE] text-white h-[48px] ${
              isLoading ? "bg-gray-600" : "bg-blue-600 hover:bg-[#4E7BEE]"
            }`}
          >
            {isLoading ? "Processing..." : "Next"}
          </Button>
          {isTimeout ? (
            <ExpiredDialog
              isOpen={isDialogOpen}
              onClose={closeDialog}
              setIsTimeout={setIsTimeout}
            />
          ) : (
            <ConfirmDialog
              isOpen={isDialogOpen}
              onClose={closeDialog}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </article>
  );
}

export default BookingSummary;
