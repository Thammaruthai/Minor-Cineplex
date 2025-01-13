import { usePayment } from "@/hooks/usePayment";
import { formatedDate, formatShowtime } from "@/utils/date";
import { Button } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

export default function BookingSuccess() {
  const { payment } = usePayment();
  const currentPayment = payment[0];

  const sortSeats = (seats) => {
    if (!Array.isArray(seats)) return "";
    return seats
      .sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true });
      })
      .join(", ");
  };

  return (
    <section className="w-full flex flex-col justify-center items-center p-4 py-10">
      <div className="md:w-[386px] w-full md:mt-28 my-10 flex flex-col gap-12 ">
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/img/success.png"
            width={80}
            height={80}
            alt="Success Icon"
            className=""
          />
          <h2 className="text-[36px] text-white">Booking success</h2>
        </div>
        <div className="flex flex-col p-6 gap-4 rounded-xl bg-[#070C1B]">
          <div className="flex flex-col gap-2 text-[#C8CEDD]">
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Pin_fill.png"
                width={0}
                height={0}
                alt="Pin icon"
                className="w-4 h-4"
              />
              <p>{currentPayment?.cinema_name}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Date_range_fill.png"
                width={0}
                height={0}
                alt="Calendar icon"
                className="w-4 h-4"
              />
              <p>{formatedDate(currentPayment?.show_date_time)}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Time_fill.png"
                width={0}
                height={0}
                alt="Time Icon"
                className="w-4 h-4"
              />
              <p>{formatShowtime(currentPayment?.show_date_time)}</p>
            </div>
            <div className="flex gap-3 items-center">
              <Image
                src="/img/Shop.png"
                width={0}
                height={0}
                alt="Shop icon"
                className="w-4 h-4"
              />
              <p>{currentPayment?.hall_name}</p>
            </div>
          </div>
          <div className="flex border border-[#21263F] w-full "></div>
          <div className="flex flex-col gap-3 text-[#8B93B0]">
            <div className="flex gap-2">
              <p className="w-[130px]">Selected Seat</p>
              <div className="flex">
                <p className="text-white font-bold">
                  {currentPayment?.selected_seats &&
                    sortSeats(currentPayment.selected_seats)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <p className="w-[130px]">Payment method</p>
              <p className="text-white font-bold">
                {currentPayment?.payment_method === "card"
                  ? "Credit card"
                  : "QR Code"}
              </p>
            </div>
            <div className="flex gap-2">
              <p className="w-[130px]">Total</p>
              <p className="text-white font-bold">
                THB{Math.round(currentPayment?.payment_amount)}
              </p>
            </div>
          </div>
        </div>
        <div className="text-white flex md:w-full min-w-[344px] gap-4 justify-between">
          <Link href="/">
            <Button className="border border-[#8B93B0] md:w-[185px] px-5 md:px-10 w-[164px]">
              Back to home
            </Button>
          </Link>

          <Link
            href={{ pathname: "/profile", query: { view: "booking-history" } }}
          >
            <Button className="bg-[#4E7BEE] md:px-10 md:w-[185px] w-[164px] px-5 ">
              Booking detail
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
