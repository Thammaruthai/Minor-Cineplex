import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LoadingPage from "@/Components/booking-history/loading-page";
import axios from "axios";
import { formatedDate, formatShowtime } from "@/utils/date";
import Image from "next/image";
import ShareModal from "@/Components/booking-history/share-modal";

export default function SharingPage() {
  const router = useRouter();
  const { booking_uuid } = router.query;
  const [loading, setLoading] = useState(true);
  const [booking, setBookingData] = useState();
  //first open will have loading screen
  useEffect(() => {
    // ตรวจสอบว่า booking_uuid มีค่าหรือไม่
    if (!booking_uuid) return;

    const fetchShowDetails = async () => {
      try {
        setLoading(true); // เปิด state การโหลดข้อมูล

        // เรียก API พร้อมส่ง booking_uuid เป็น query parameter
        const response = await axios.get(
          `/api/sharing/showfetch?booking_uuid=${booking_uuid}`
        );

        // อัปเดตข้อมูลที่ได้รับจาก API
        setBookingData(response.data.booking);
       
      } catch (err) {
        console.error("Error fetching show details:", err); // Log error เพื่อการ debug
      } finally {
        setLoading(false); // ปิด state การโหลดข้อมูล
      }
    };

    fetchShowDetails();
  }, [booking_uuid]);

  const handleBookingnow = async (showID) => {
    router.push(`/booking/${showID}`);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div
        className={` flex items-center justify-center cursor-default   backdrop-blur-sm transition-opacity duration-300 my-10 `}
      >
        {/* หน้าต่าง Modal */}
        <div
          className={`relative bg-[#070C1B] shadow-lg  w-[691px] z-30 rounded-lg  animate-fadeIn cursor-default transition-opacity duration-300 max-sm:w-11/12 overflow-y-auto max-h-screen `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center items-center h-[50px] px-6 py-3 ">
            <span className="text-white">Booking Detail</span>
          </div>
          <div className="bg-[#070C1B] p-6 flex flex-col gap-6 max-sm:p-4 max-sm:gap-4">
            {/* Modal Movie Poster */}
            <div className="flex items-start gap-4 w-full ">
              <img
                src={booking.poster}
                alt={booking.title}
                className="w-24 h-32 rounded-lg object-cover max-sm:w-[96px] max-sm:h-[140px]"
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
                <div className="text-[#8B93B0] text-sm max-sm:hidden">
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
            <div className="text-[#8B93B0] text-sm sm:hidden">
              <div className="flex gap-3 ">
                <p>Booking No.</p>
                <p>{booking.temp_booking_uuid.slice(0, 8)}</p>
              </div>
              <div className="flex gap-3 ">
                <p>Booked date</p>
                <p>{formatedDate(booking.booking_date)}</p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-[#2D3748] "></div>
            {/* Modal Ticket Info */}
            <div className="flex justify-between items-center w-full ">
              <div className="flex gap-6 items-center max-sm:w-full">
                <div className="bg-[#21263F] flex items-center justify-center rounded px-4 py-3 h-12 min-w-[84px]">
                  <p className="text-sm font-bold">
                    {booking.seats.length}{" "}
                    {booking.seats.length > 1 ? "Tickets" : "Ticket"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 max-w-[450px] text-sm max-sm:w-full">
                  <div className="flex gap-2 justify-between">
                    <p className=" text-[#8B93B0]">Selected Seat:</p>
                    <p className="max-w-[350px] text-[#C8CEDD]">
                      {booking.seats.length > 12
                        ? `${booking.seats.slice(0, 12).join(", ")}, ...`
                        : booking.seats.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex flex-row justify-center items-center bg-[#4E7BEE] p-4 w-full text-base max-sm:flex-col max-sm:p-4 max-sm:items-start max-sm:gap-6 hover:bg-[#1E29A8] cursor-pointer"
            onClick={() => handleBookingnow(booking.show_id)}
          >
            Book Now
          </div>
        </div>
      </div>
    </>
  );
}
