import React from "react";
import Image from "next/image";

const BookingHistory = ({ bookings }) => {
  return (
    <div className="p-6 bg-[#0E1423] text-[#C8CEDD] rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Booking history</h2>
      <div className="space-y-6">
        {bookings.map((booking, index) => (
          <div
            key={index}
            className="p-4 bg-[#070C1B] rounded-lg flex flex-col  justify-between items-start gap-4 w-[691px]"
          >
            {/* Movie Poster */}
            <div className="flex items-start gap-4">
              <img
                src={booking.poster}
                alt={booking.movieTitle}
                className="w-24 h-32 rounded-lg object-cover"
              />

              {/* Booking Info */}
              <div className="flex flex-col gap-2 text-[#C8CEDD]">
                <div>
                  <h3 className="text-white text-xl font-bold">
                    {booking.movieTitle}
                  </h3>
                </div>
                <div className="flex gap-3 items-center">
                  <Image
                    src="/img/Pin_fill.png"
                    width={0}
                    height={0}
                    alt="Pin icon"
                    className="w-4 h-4"
                  />
                  <p>{booking.cinemaName}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Image
                    src="/img/Date_range_fill.png"
                    width={0}
                    height={0}
                    alt="Calendar icon"
                    className="w-4 h-4"
                  />
                  <p>{booking.date}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Image
                    src="/img/Time_fill.png"
                    width={0}
                    height={0}
                    alt="Time Icon"
                    className="w-4 h-4"
                  />
                  <p>{booking.time}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Image
                    src="/img/Shop.png"
                    width={0}
                    height={0}
                    alt="Shop icon"
                    className="w-4 h-4"
                  />
                  <p>{booking.hall}</p>
                </div>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#2D3748] "></div>
            {/* Ticket Info */}
            <div className="flex justify-between items-center w-full ">
              <div className="flex gap-4 items-centerb">
                <div className="bg-[#21263F] flex items-center justify-center rounded-lg px-4 py-3">
                  <p className="text-sm font-bold">
                    {booking.ticketCount}{" "}
                    {booking.ticketCount > 1 ? "Tickets" : "Ticket"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    Selected Seat: {booking.seats.join(", ")}
                  </p>
                  <p className="text-sm text-gray-400">
                    Payment method: {booking.paymentMethod}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 sm:mt-0 px-4 py-1 text-sm font-bold rounded-full ${
                  booking.status === "Paid"
                    ? "bg-[#00A372] text-white"
                    : booking.status === "Completed"
                    ? "border border-[#21263F] text-white"
                    : "bg-[#565F7E] text-white"
                }`}
              >
                {booking.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
