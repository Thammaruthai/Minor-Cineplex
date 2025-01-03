import React from "react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import jwtInterceptor from "@/utils/jwt-interceptor";
import { formatedDate, formatShowtime } from "@/utils/date";
import { useRouter } from "next/router";

const BookingHistory = ({ bookings }) => {
  const router = useRouter();

  // State สำหรับเก็บข้อมูล Booking History
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading, please wait.");
  const [page, setPage] = useState(0); // Current page for pagination
  const [hasMore, setHasMore] = useState(true); // Whether there is more data to load

  // State สำหรับการควบคุม Modal แยกกัน
  const [openModal, setOpenModal] = useState(null);
  const toggleModal = (id) => {
    setOpenModal(openModal === id ? null : id); // ถ้าเปิดอยู่ให้ปิด, ถ้าปิดให้เปิด
  };

  // สร้าง ref สำหรับใช้ในการตรวจจับ Element สุดท้ายของ List
  const observer = useRef();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        jwtInterceptor();
        const response = await axios.get(
          `/api/booking-history/fetch-booking-history`,
          {
            params: { page, limit: 4 }, // Send pagination params
          }
        );

        setBookingHistory((prev) => {
          const newBookings = response.data.booking_history.filter(
            (newBooking) =>
              !prev.some(
                (existingBooking) =>
                  existingBooking.booking_id === newBooking.booking_id
              )
          );
          return [...prev, ...newBookings];
        });
        setHasMore(response.data.booking_history.length > 0); // Check if there is more data
      } catch (err) {
        console.log(err.response?.data?.error || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);
  function formatPrice(price) {
    const numericPrice = parseFloat(price);
    return price % 1 === 0 ? numericPrice.toFixed(0) : numericPrice.toFixed(2);
  }
  // Infinite scrolling using IntersectionObserver
  const lastBookingRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1); // Load next page
      }
    });

    if (node) observer.current.observe(node);
  };

  const handlePaynow = async (payment_uuid) => {
    console.log(payment_uuid);

    router.push(`/payments/${payment_uuid}`);
  };

  if (loading && page === 0) {
    return (
      <div className="p-6 text-[#C8CEDD] rounded-lg w-[691px]">
        <h2 className="text-2xl font-bold mb-6">Booking history</h2>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-white gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
            <p className="animate-pulse">{loadingText}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-[#C8CEDD] rounded-lg font-robotoCondensed">
      <h2 className="text-2xl font-bold mb-6">Booking history</h2>
      <div className="space-y-6 relative">
        {bookingHistory.map((booking, index) => (
          <div
            key={index}
            ref={index === bookingHistory.length - 1 ? lastBookingRef : null}
            onClick={() => toggleModal(booking.booking_id)}
            className="p-4 bg-[#070C1B] rounded-lg flex flex-col  justify-between items-start gap-4 w-[691px]  animate-fadeInFromRight hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 ease-in-out cursor-pointer "
          >
            {/* Movie Poster */}
            <div className="flex items-start gap-4 w-full">
              <img
                src={booking.poster}
                alt={booking.title}
                className="w-24 h-32 rounded-lg object-cover"
              />
              <div className="flex flex-row justify-between items-start w-full">
                {/* Booking Info */}
                <div className="flex flex-col gap-3 text-[#C8CEDD] text-sm">
                  <h3 className="text-white text-xl font-bold">
                    {booking.title}
                  </h3>
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/img/Pin_fill.png"
                        width={0}
                        height={0}
                        alt="Pin icon"
                        className="w-4 h-4"
                      />
                      <p>{booking.cinema_name}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/img/Date_range_fill.png"
                        width={0}
                        height={0}
                        alt="Calendar icon"
                        className="w-4 h-4"
                      />
                      <p>{formatedDate(booking.booking_date)}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/img/Time_fill.png"
                        width={0}
                        height={0}
                        alt="Time Icon"
                        className="w-4 h-4"
                      />
                      <p>{formatShowtime(booking.show_date_time)}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/img/Shop.png"
                        width={0}
                        height={0}
                        alt="Shop icon"
                        className="w-4 h-4"
                      />
                      <p>{booking.hall_name}</p>
                    </div>
                  </div>
                </div>
                <div className="text-[#8B93B0] text-sm">
                  <div className="flex gap-3 ">
                    <p>Booking No.</p>
                    <p>{booking.temp_booking_uuid.slice(0, 8)}</p>
                  </div>
                  <div className="flex gap-3 ">
                    <p>Booked date</p>
                    <p>{formatedDate(booking.booking_date)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#2D3748] "></div>
            {/* Ticket Info */}
            <div className="flex justify-between items-center w-full ">
              <div className="flex gap-6 items-center">
                <div className="bg-[#21263F] flex items-center justify-center rounded px-4 py-3 h-12 min-w-[84px]">
                  <p className="text-sm font-bold">
                    {booking.seats.length}{" "}
                    {booking.seats.length > 1 ? "Tickets" : "Ticket"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 max-w-[450px] text-sm">
                  <div className="flex gap-2 justify-between">
                    <p className=" text-[#8B93B0]">Selected Seat:</p>
                    <p className="max-w-[350px] text-[#C8CEDD]">
                      {booking.seats.length > 12
                        ? `${booking.seats.slice(0, 12).join(", ")}, ...`
                        : booking.seats.join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <p className="text-[#8B93B0]">Payment method: </p>
                    <p className="max-w-[350px] text-[#C8CEDD]">
                      {booking.payment_method === "card"
                        ? "Credit Card"
                        : booking.booking_status === "Active" &&
                          booking.payment_status === null
                        ? "Waiting for payment"
                        : booking.booking_status === "Cancelled" &&
                          booking.payment_status === null
                        ? "-"
                        : "Cancelled"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`mt-4 sm:mt-0 px-4 py-1 text-sm font-bold rounded-full ${
                  booking.payment_status === "succeeded" &&
                  new Date(booking.show_date_time).getTime() +
                    24 * 60 * 60 * 1000 <
                    Date.now()
                    ? "border border-[#21263F] text-white"
                    : booking.payment_status === "succeeded" &&
                      new Date(booking.show_date_time).getTime() +
                        24 * 60 * 60 * 1000 >
                        Date.now()
                    ? "bg-[#00A372] text-white"
                    : booking.booking_status === "Active" &&
                      booking.payment_status === null
                    ? "bg-orange-600 text-white"
                    : booking.booking_status === "Cancelled" &&
                      booking.payment_status === null
                    ? "bg-[#565F7E]"
                    : "bg-[#565F7E]"
                }`}
              >
                {booking.payment_status === "succeeded" &&
                new Date(booking.show_date_time).getTime() +
                  24 * 60 * 60 * 1000 <
                  Date.now()
                  ? "Complete"
                  : booking.payment_status === "succeeded" &&
                    new Date(booking.show_date_time).getTime() +
                      24 * 60 * 60 * 1000 >
                      Date.now()
                  ? "Paid"
                  : booking.booking_status === "Active" &&
                    booking.payment_status === null
                  ? "Waiting for payment"
                  : booking.booking_status === "Cancelled" &&
                    booking.payment_status === null
                  ? "Expired"
                  : "Cancelled"}
              </div>
            </div>

            {/* พื้นหลังมืด + Modal */}
            {/* Modal */}

            {openModal === booking.booking_id && (
              <div className="fixed inset-0 z-50 flex items-center justify-center cursor-default">
                {/* พื้นหลังมืด */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-15 backdrop-blur-sm "
                  onClick={() => toggleModal(null)} // ปิด Modal เมื่อคลิกด้านนอก
                ></div>

                {/* หน้าต่าง Modal */}
                <div
                  className={`relative bg-[#21263F]  shadow-lg  w-[691px] z-10 rounded-lg border border-[#565F7E] animate-fadeIn cursor-default`}
                >
                  <div className="flex justify-between items-center h-[50px] px-6 py-3 ">
                    <div className="text-xl font-bold w-[64px]"></div>
                    <span className="text-white">Booking Deatail</span>
                    <div className="flex gap-4 w-[64px]">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 3V2.5H20.5V3H20ZM10.3536 13.3536C10.1583 13.5488 9.84171 13.5488 9.64645 13.3536C9.45118 13.1583 9.45118 12.8417 9.64645 12.6464L10.3536 13.3536ZM19.5 11V3H20.5V11H19.5ZM20 3.5H12V2.5H20V3.5ZM20.3536 3.35355L10.3536 13.3536L9.64645 12.6464L19.6464 2.64645L20.3536 3.35355Z"
                          fill="#C8CEDD"
                        />
                        <path
                          d="M18 14.625V14.625C18 15.9056 18 16.5459 17.8077 17.0568C17.5034 17.8653 16.8653 18.5034 16.0568 18.8077C15.5459 19 14.9056 19 13.625 19H10C7.17157 19 5.75736 19 4.87868 18.1213C4 17.2426 4 15.8284 4 13V9.375C4 8.09442 4 7.45413 4.19228 6.94325C4.4966 6.1347 5.1347 5.4966 5.94325 5.19228C6.45413 5 7.09442 5 8.375 5V5"
                          stroke="#C8CEDD"
                          stroke-linecap="round"
                        />
                      </svg>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18"
                          stroke="#C8CEDD"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6 6L18 18"
                          stroke="#C8CEDD"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-[#070C1B] p-6 flex flex-col gap-6">
                    {/* Modal Movie Poster */}
                    <div className="flex items-start gap-4 w-full ">
                      <img
                        src={booking.poster}
                        alt={booking.title}
                        className="w-24 h-32 rounded-lg object-cover"
                      />
                      <div className="flex flex-row justify-between items-start w-full">
                        {/* Modal Booking Info */}
                        <div className="flex flex-col gap-3 text-[#C8CEDD] text-sm">
                          <h3 className="text-white text-xl font-bold">
                            {booking.title}
                          </h3>
                          <div className="flex flex-col gap-1 items-start">
                            <div className="flex gap-3 items-center">
                              <Image
                                src="/img/Pin_fill.png"
                                width={0}
                                height={0}
                                alt="Pin icon"
                                className="w-4 h-4"
                              />
                              <p>{booking.cinema_name}</p>
                            </div>
                            <div className="flex gap-3 items-center">
                              <Image
                                src="/img/Date_range_fill.png"
                                width={0}
                                height={0}
                                alt="Calendar icon"
                                className="w-4 h-4"
                              />
                              <p>{formatedDate(booking.booking_date)}</p>
                            </div>
                            <div className="flex gap-3 items-center">
                              <Image
                                src="/img/Time_fill.png"
                                width={0}
                                height={0}
                                alt="Time Icon"
                                className="w-4 h-4"
                              />
                              <p>{formatShowtime(booking.show_date_time)}</p>
                            </div>
                            <div className="flex gap-3 items-center">
                              <Image
                                src="/img/Shop.png"
                                width={0}
                                height={0}
                                alt="Shop icon"
                                className="w-4 h-4"
                              />
                              <p>{booking.hall_name}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-[#8B93B0] text-sm">
                          <div className="flex gap-3 ">
                            <p>Booking No.</p>
                            <p>{booking.temp_booking_uuid.slice(0, 8)}</p>
                          </div>
                          <div className="flex gap-3 ">
                            <p>Booked date</p>
                            <p>{formatedDate(booking.booking_date)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#2D3748] "></div>
                    {/* Modal Ticket Info */}
                    <div className="flex justify-between items-center w-full ">
                      <div className="flex gap-6 items-center">
                        <div className="bg-[#21263F] flex items-center justify-center rounded px-4 py-3 h-12 min-w-[84px]">
                          <p className="text-sm font-bold">
                            {booking.seats.length}{" "}
                            {booking.seats.length > 1 ? "Tickets" : "Ticket"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 max-w-[450px] text-sm">
                          <div className="flex gap-2 justify-between">
                            <p className=" text-[#8B93B0]">Selected Seat:</p>
                            <p className="max-w-[350px] text-[#C8CEDD]">
                              {booking.seats.length > 12
                                ? `${booking.seats
                                    .slice(0, 12)
                                    .join(", ")}, ...`
                                : booking.seats.join(", ")}
                            </p>
                          </div>
                          <div className="flex gap-2 justify-between">
                            <p className="text-[#8B93B0]">Payment method: </p>
                            <p className="max-w-[350px] text-[#C8CEDD]">
                              {booking.payment_method === "card"
                                ? "Credit Card"
                                : booking.booking_status === "Active" &&
                                  booking.payment_status === null
                                ? "Waiting for payment"
                                : booking.booking_status === "Cancelled" &&
                                  booking.payment_status === null
                                ? "-"
                                : "Cancelled"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`mt-4 sm:mt-0 px-4 py-1 text-sm font-bold rounded-full ${
                          booking.payment_status === "succeeded" &&
                          new Date(booking.show_date_time).getTime() +
                            24 * 60 * 60 * 1000 <
                            Date.now()
                            ? "border border-[#21263F] text-white"
                            : booking.payment_status === "succeeded" &&
                              new Date(booking.show_date_time).getTime() +
                                24 * 60 * 60 * 1000 >
                                Date.now()
                            ? "bg-[#00A372] text-white"
                            : booking.booking_status === "Active" &&
                              booking.payment_status === null
                            ? "bg-orange-600 text-white"
                            : booking.booking_status === "Cancelled" &&
                              booking.payment_status === null
                            ? "bg-[#565F7E]"
                            : "bg-[#565F7E]"
                        }`}
                      >
                        {booking.payment_status === "succeeded" &&
                        new Date(booking.show_date_time).getTime() +
                          24 * 60 * 60 * 1000 <
                          Date.now()
                          ? "Complete"
                          : booking.payment_status === "succeeded" &&
                            new Date(booking.show_date_time).getTime() +
                              24 * 60 * 60 * 1000 >
                              Date.now()
                          ? "Paid"
                          : booking.booking_status === "Active" &&
                            booking.payment_status === null
                          ? "Waiting for payment"
                          : booking.booking_status === "Cancelled" &&
                            booking.payment_status === null
                          ? "Expired"
                          : "Cancelled"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-end bg-[#21263F] p-6 w-full text-base ">
                    <div className="flex  flex-col justify-between gap-2 w-[273px]">
                      <div className="flex justify-between  ">
                        <span>Payment method</span>
                        <span className="text-white">
                          {booking.payment_method === "card"
                            ? "Credit Card"
                            : booking.booking_status === "Active" &&
                              booking.payment_status === null
                            ? "Waiting for payment"
                            : booking.booking_status === "Cancelled" &&
                              booking.payment_status === null
                            ? "-"
                            : "Cancelled"}
                        </span>
                      </div>
                      <div className="flex justify-between ">
                        <span>Ticket x{booking.seats.length}</span>
                        <span className="text-white">
                          THB{formatPrice(booking.total_price)}
                        </span>
                      </div>
                      <div className="flex justify-between ">
                        <span>Coupon</span>
                        <span className="text-[#E5364B]">
                          -THB{formatPrice(booking.discount_applied)}
                        </span>
                      </div>
                      <div className="w-full h-[1px] bg-[#2D3748] "></div>
                      <div className="flex justify-between ">
                        <span>Total</span>
                        <span className="text-white">
                          -THB{formatPrice(booking.final_price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      {booking.booking_status === "Active" &&
                        booking.payment_status === null && (
                          <button
                            className="bg-[#4E7BEE] text-white rounded-lg w-[179px] h-[48px] border border-[#8B93B0] hover:bg-[#1E29A8]  "
                            onClick={() =>
                              handlePaynow(booking.temp_booking_uuid)
                            }
                          >
                            Pay now!
                          </button>
                        )}
                      { booking.payment_status === "succeeded" && (
                          <button className=" text-white rounded-lg w-[179px] h-[48px] border border-[#8B93B0] hover:bg-[#C92A42]  ">
                            Cancel booking
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {!hasMore && (
          <p className="text-center text-gray-500">No more bookings to load.</p>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
