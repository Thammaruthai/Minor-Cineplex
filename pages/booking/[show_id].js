import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import jwtInterceptor from "@/utils/jwt-interceptor";

const SeatSelectionPage = () => {
  const router = useRouter();
  const { show_id } = router.query;

  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading, please wait.");
  const [notLogin, setNotLogin] = useState(false); // Assuming you set this based on login status
  const [countdown, setCountdown] = useState(3); // Set initial countdown value
  const [showCountdown, setShowCountdown] = useState(false);

  const buttonStyleDisabled = "bg-gray-500 w-full py-3 cursor-not-allowed";
  const buttonStyleEnabled =
    "bg-[#4E7BEE] w-full py-3 hover:bg-[#1E29A8] active:[#0C1580]"; //
  // Animate the loading text
  useEffect(() => {
    if (loading) {
      let dots = "";
      const interval = setInterval(() => {
        dots = dots.length < 3 ? dots + "." : "";
        setLoadingText(`Loading, please wait${dots}`);
      }, 200); //
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [loading]);

  //
  useEffect(() => {
    if (!show_id) return;

    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/booking/showfetch", {
          params: { show_Id: show_id },
        });
        setShowDetails(response.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [show_id]);

  useEffect(() => {
    if (notLogin) {
      setShowCountdown(true); // Trigger the countdown display
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            window.location.href = "/login"; // Redirect after countdown
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [notLogin]); // Trigger useEffect only when `notLogin` changes

  const toggleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleSubmit = async () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    const userUUID =
      sessionStorage.getItem("UUID") || localStorage.getItem("UUID");

    if (!token) {
      setNotLogin(true);
      return;
    }

    try {
      const data = {
        showDetails,
        booking: selectedSeats,
        userUUID,
        price: selectedSeats.length * 150,
      };
      console.log(data);
      
      // Ensure JWT interceptor is active
      jwtInterceptor();

      // POST request to the confirm booking API
      const response = await axios.post("/api/booking/confirm-booking", data);

      if (response.status === 200) {
        
        setSelectedSeats([]);
        //window.location.href = `/payment/${response.data.payment}`;

        // Redirect or perform another action after success
      }
    } catch (error) {
      console.error("Error during API call:", error);

      if (error.response?.status === 401 || error.response?.status === 500) {
        
        window.location.href = "/login"; // Redirect to login
      } else {
        alert(`${error}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#070C1B]">
        <div className="flex flex-col items-center justify-center text-white gap-4">
          {/* Spinner Animation */}
          <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
          <p className="animate-pulse">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render "Not Logged In" UI if `notLogin` is true
  if (notLogin) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-white h-screen bg-slate-900 min-h-[640px] min-w-[300px] animate-fade-in">
        <div className="flex flex-col gap-6 w-[380px] rounded-lg text-center max-sm:w-11/12 animate-scale-up">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full text-[44px] text-white bg-blue-400 animate-bounce">
              {"➜"}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold">Login Required</h1>
            <p className="text-base text-gray-400">
              Redirecting to the login page in{" "}
              <span className="text-green-500">{countdown} seconds</span>.
            </p>
          </div>
          <button
            className="bg-[#4E7BEE] w-full py-3 mt-4 hover:bg-[#1E29A8]"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white  mt-[20px]">
      {/* Steps Header */}
      <div className="flex justify-center items-center mb-8 bg-[#070C1B] h-[108px]">
        <div className="flex gap-8">
          <div className="flex flex-col items-center w-[140px] gap-1.5">
            <div className="w-11 h-11 rounded-full bg-[#1E29A8] flex items-center justify-center text-white text-xl">
              ✔
            </div>
            <span className="text-gray-300">Select Showtime</span>
          </div>
          <div className="flex flex-col items-center w-[140px] gap-1.5">
            <div className="w-11 h-11 rounded-full bg-[#4E7BEE] flex items-center justify-center text-white text-xl">
              2
            </div>
            <span className=" text-gray-300">Select Seat</span>
          </div>
          <div className="flex flex-col items-center w-[140px] gap-1.5">
            <div className="w-11 h-11 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xl">
              3
            </div>
            <span className="text-gray-400">Payment</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-[60px] items-start justify-center ">
        {/* Seat Map */}
        <div className="flex flex-col  rounded-lg gap-[60px] min-w-[793px] ">
          <div className="flex items-center justify-center w-full h-11 text-center text-xl font-semibold mb-4 rounded-t-full bg-gradient-to-r from-[#2C344E] to-[#516199]">
            <div className="w-full ">screen</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-[30px]">
            {Object.entries(
              showDetails.seats
                .sort((a, b) => {
                  // Sort by seat_row descending and seat_number ascending
                  if (a.seat_row < b.seat_row) return 1;
                  if (a.seat_row > b.seat_row) return -1;
                  if (a.seat_number < b.seat_number) return -1;
                  if (a.seat_number > b.seat_number) return 1;
                  return 0;
                })
                .reduce((groupedSeats, seat) => {
                  // Group seats by seat_row
                  if (!groupedSeats[seat.seat_row]) {
                    groupedSeats[seat.seat_row] = [];
                  }
                  groupedSeats[seat.seat_row].push(seat);
                  return groupedSeats;
                }, {})
            ).map(([row, seats]) => {
              const midIndex = Math.ceil(seats.length / 2); // Find the middle index
              const leftSeats = seats.slice(0, midIndex); // Left group
              const rightSeats = seats.slice(midIndex); // Right group

              return (
                <div key={row} className="flex items-center gap-4 mb-2">
                  {/* Row label at the start */}
                  <span className="font-bold text-[#8B93B0]">{row}</span>

                  {/* Left seats */}
                  <div className="flex gap-6">
                    {leftSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(
                        `${seat.seat_row}${seat.seat_number}`
                      );

                      return (
                        <button
                          key={seat.seat_id}
                          onClick={() =>
                            seat.booking_status === "Available" &&
                            toggleSeatSelection(
                              `${seat.seat_row}${seat.seat_number}`
                            )
                          }
                          className={`${isSelected ? "animate-bounce" : ""} ${
                            seat.booking_status === "Locked" ||
                            seat.booking_status === "Booked"
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                          disabled={seat.booking_status !== "Available"} // Prevent interaction with non-available seats
                        >
                          {seat.booking_status === "Booked" ? (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.75"
                                y="0.75"
                                width="38.5"
                                height="38.5"
                                rx="5.25"
                                fill="#565F7E"
                                stroke="#8B93B0"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M25 12.5L15 22.5M15 12.5L25 22.5"
                                stroke="#8B93B0"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M0 20H7C8.65685 20 10 21.3431 10 23V29.5C10 31.1569 11.3431 32.5 13 32.5H27C28.6569 32.5 30 31.1569 30 29.5V23C30 21.3431 31.3431 20 33 20H40"
                                stroke="#8B93B0"
                                strokeWidth="1.5"
                              />
                            </svg>
                          ) : seat.booking_status === "Locked" ? (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="40"
                                height="40"
                                rx="6"
                                fill="#4E7BEE"
                                fillOpacity="0.4"
                              />
                              <rect
                                x="0.75"
                                y="0.75"
                                width="38.5"
                                height="38.5"
                                rx="5.25"
                                stroke="#4E7BEE"
                                strokeOpacity="0.4"
                                strokeWidth="1.5"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M23.7987 15.0399C23.4225 15.6995 22.8816 16.2502 22.2288 16.6381C22.0075 16.7681 21.875 16.9787 21.875 17.2006V17.2994C21.875 17.5206 22.0075 17.7312 22.2294 17.8625C22.8824 18.25 23.4235 18.8005 23.7996 19.4601C24.1758 20.1197 24.3741 20.8657 24.375 21.625V22.25H25V23.5H15V22.25H15.625V21.625C15.6265 20.8656 15.8251 20.1197 16.2013 19.4601C16.5775 18.8005 17.1184 18.2498 17.7713 17.8619C17.9925 17.7306 18.125 17.5206 18.125 17.2994V17.2006C18.125 16.9787 17.9925 16.7681 17.7713 16.6381C17.1184 16.2502 16.5775 15.6995 16.2013 15.0399C15.8251 14.3803 15.6265 13.6344 15.625 12.875V12.25H15V11H25V12.25H24.375V12.875C24.3735 13.6344 24.1749 14.3803 23.7987 15.0399ZM22.7143 20.0798C22.4461 19.6089 22.0601 19.2158 21.5944 18.9387C21.0985 18.6459 20.7663 18.1837 20.661 17.6607C20.4692 17.7891 20.2427 17.875 20 17.875C19.7573 17.875 19.5308 17.7891 19.339 17.6607C19.2337 18.1837 18.9016 18.6458 18.4062 18.9381C17.9403 19.2151 17.5542 19.6084 17.2858 20.0793C17.0355 20.5185 16.8955 21.0113 16.8771 21.5155C17.5492 21.2301 18.697 21 20 21C21.303 21 22.4508 21.2301 23.1229 21.5155C23.1045 21.0115 22.9645 20.5189 22.7143 20.0798ZM22.4816 14.7723C22.8914 14.2353 23.125 13.5693 23.125 12.875V12.25H16.875V12.875C16.8759 13.4169 17.0174 13.9494 17.2857 14.4202C17.3557 14.5431 17.4337 14.6607 17.5191 14.7724C17.6907 14.7975 17.892 14.8413 18.1169 14.8902C18.6406 15.0042 19.2929 15.1461 20 15.1461C20.7071 15.1461 21.3594 15.0042 21.8831 14.8902C22.1084 14.8412 22.3098 14.7974 22.4816 14.7723Z"
                                fill="#8EAEFF"
                              />
                              <path
                                opacity="0.4"
                                d="M0 20H7C8.65685 20 10 21.3431 10 23V29.5C10 31.1569 11.3431 32.5 13 32.5H27C28.6569 32.5 30 31.1569 30 29.5V23C30 21.3431 31.3431 20 33 20H40"
                                stroke="#4E7BEE"
                                strokeWidth="1.5"
                              />
                            </svg>
                          ) : isSelected ? (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 43 43"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1"
                                y="1"
                                width="38"
                                height="38"
                                rx="5"
                                fill="#4E7BEE"
                              />
                              <rect
                                x="1"
                                y="1"
                                width="38"
                                height="38"
                                rx="5"
                                stroke="white"
                                strokeWidth="2"
                              />
                              <rect
                                x="23"
                                y="23"
                                width="20"
                                height="20"
                                rx="10"
                                fill="white"
                              />
                              <path
                                d="M28.9167 34.1667L30.4831 35.3415C30.9118 35.663 31.5177 35.5895 31.857 35.1747L36.5 29.5"
                                stroke="#4E7BEE"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M1 20H6.86667C8.52352 20 9.86667 21.3431 9.86667 23V29C9.86667 30.6569 11.2098 32 12.8667 32H27.1333C28.7902 32 30.1333 30.6569 30.1333 29V23C30.1333 21.3431 31.4765 20 33.1333 20H39"
                                stroke="white"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.75"
                                y="0.75"
                                width="38.5"
                                height="38.5"
                                rx="5.25"
                                fill="#8EAEFF"
                                stroke="#4E7BEE"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M1 20H6.86667C8.52352 20 9.86667 21.3431 9.86667 23V29C9.86667 30.6569 11.2098 32 12.8667 32H27.1333C28.7902 32 30.1333 30.6569 30.1333 29V23C30.1333 21.3431 31.4765 20 33.1333 20H39"
                                stroke="#4E7BEE"
                                strokeWidth="1.5"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Space in the middle */}
                  <div className="w-10"></div>

                  {/* Right seats */}
                  <div className="flex gap-6">
                    {rightSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(
                        `${seat.seat_row}${seat.seat_number}`
                      );

                      return (
                        <button
                          key={seat.seat_id}
                          onClick={() =>
                            seat.booking_status === "Available" &&
                            toggleSeatSelection(
                              `${seat.seat_row}${seat.seat_number}`
                            )
                          }
                          className={`${isSelected ? "animate-bounce" : ""} ${
                            seat.booking_status === "Locked" ||
                            seat.booking_status === "Booked"
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                          disabled={seat.booking_status !== "Available"} // Prevent interaction with non-available seats
                        >
                          {seat.booking_status === "Booked" ? (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.75"
                                y="0.75"
                                width="38.5"
                                height="38.5"
                                rx="5.25"
                                fill="#565F7E"
                                stroke="#8B93B0"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M25 12.5L15 22.5M15 12.5L25 22.5"
                                stroke="#8B93B0"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M0 20H7C8.65685 20 10 21.3431 10 23V29.5C10 31.1569 11.3431 32.5 13 32.5H27C28.6569 32.5 30 31.1569 30 29.5V23C30 21.3431 31.3431 20 33 20H40"
                                stroke="#8B93B0"
                                strokeWidth="1.5"
                              />
                            </svg>
                          ) : seat.booking_status === "Locked" ? (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="40"
                                height="40"
                                rx="6"
                                fill="#4E7BEE"
                                fillOpacity="0.4"
                              />
                              <rect
                                x="0.75"
                                y="0.75"
                                width="38.5"
                                height="38.5"
                                rx="5.25"
                                stroke="#4E7BEE"
                                strokeOpacity="0.4"
                                strokeWidth="1.5"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M23.7987 15.0399C23.4225 15.6995 22.8816 16.2502 22.2288 16.6381C22.0075 16.7681 21.875 16.9787 21.875 17.2006V17.2994C21.875 17.5206 22.0075 17.7312 22.2294 17.8625C22.8824 18.25 23.4235 18.8005 23.7996 19.4601C24.1758 20.1197 24.3741 20.8657 24.375 21.625V22.25H25V23.5H15V22.25H15.625V21.625C15.6265 20.8656 15.8251 20.1197 16.2013 19.4601C16.5775 18.8005 17.1184 18.2498 17.7713 17.8619C17.9925 17.7306 18.125 17.5206 18.125 17.2994V17.2006C18.125 16.9787 17.9925 16.7681 17.7713 16.6381C17.1184 16.2502 16.5775 15.6995 16.2013 15.0399C15.8251 14.3803 15.6265 13.6344 15.625 12.875V12.25H15V11H25V12.25H24.375V12.875C24.3735 13.6344 24.1749 14.3803 23.7987 15.0399ZM22.7143 20.0798C22.4461 19.6089 22.0601 19.2158 21.5944 18.9387C21.0985 18.6459 20.7663 18.1837 20.661 17.6607C20.4692 17.7891 20.2427 17.875 20 17.875C19.7573 17.875 19.5308 17.7891 19.339 17.6607C19.2337 18.1837 18.9016 18.6458 18.4062 18.9381C17.9403 19.2151 17.5542 19.6084 17.2858 20.0793C17.0355 20.5185 16.8955 21.0113 16.8771 21.5155C17.5492 21.2301 18.697 21 20 21C21.303 21 22.4508 21.2301 23.1229 21.5155C23.1045 21.0115 22.9645 20.5189 22.7143 20.0798ZM22.4816 14.7723C22.8914 14.2353 23.125 13.5693 23.125 12.875V12.25H16.875V12.875C16.8759 13.4169 17.0174 13.9494 17.2857 14.4202C17.3557 14.5431 17.4337 14.6607 17.5191 14.7724C17.6907 14.7975 17.892 14.8413 18.1169 14.8902C18.6406 15.0042 19.2929 15.1461 20 15.1461C20.7071 15.1461 21.3594 15.0042 21.8831 14.8902C22.1084 14.8412 22.3098 14.7974 22.4816 14.7723Z"
                                fill="#8EAEFF"
                              />
                              <path
                                opacity="0.4"
                                d="M0 20H7C8.65685 20 10 21.3431 10 23V29.5C10 31.1569 11.3431 32.5 13 32.5H27C28.6569 32.5 30 31.1569 30 29.5V23C30 21.3431 31.3431 20 33 20H40"
                                stroke="#4E7BEE"
                                strokeWidth="1.5"
                              />
                            </svg>
                          ) : isSelected ? (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 43 43"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="1"
                                y="1"
                                width="38"
                                height="38"
                                rx="5"
                                fill="#4E7BEE"
                              />
                              <rect
                                x="1"
                                y="1"
                                width="38"
                                height="38"
                                rx="5"
                                stroke="white"
                                strokeWidth="2"
                              />
                              <rect
                                x="23"
                                y="23"
                                width="20"
                                height="20"
                                rx="10"
                                fill="white"
                              />
                              <path
                                d="M28.9167 34.1667L30.4831 35.3415C30.9118 35.663 31.5177 35.5895 31.857 35.1747L36.5 29.5"
                                stroke="#4E7BEE"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M1 20H6.86667C8.52352 20 9.86667 21.3431 9.86667 23V29C9.86667 30.6569 11.2098 32 12.8667 32H27.1333C28.7902 32 30.1333 30.6569 30.1333 29V23C30.1333 21.3431 31.4765 20 33.1333 20H39"
                                stroke="white"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="40"
                              height="40"
                              viewBox="0 0 40 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.75"
                                y="0.75"
                                width="38.5"
                                height="38.5"
                                rx="5.25"
                                fill="#8EAEFF"
                                stroke="#4E7BEE"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M1 20H6.86667C8.52352 20 9.86667 21.3431 9.86667 23V29C9.86667 30.6569 11.2098 32 12.8667 32H27.1333C28.7902 32 30.1333 30.6569 30.1333 29V23C30.1333 21.3431 31.4765 20 33.1333 20H39"
                                stroke="#4E7BEE"
                                strokeWidth="1.5"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row label at the end */}
                  <span className="text-[#8B93B0] font-bold">{row}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between items-center text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="w-[full] lg:w-1/3 bg-[#1A1D3A] p-6 rounded-lg">
          <img
            src={showDetails.movie.poster}
            alt={showDetails.movie.title}
            className="w-[305px] rounded mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">
            {showDetails.movie.title}
          </h2>
          <p className="text-gray-300 mb-2">
            <strong>Time:</strong>{" "}
            {new Date(showDetails.show.show_date_time).toLocaleTimeString()}
          </p>
          <p className="text-gray-300 mb-4">
            <strong>Hall:</strong> {showDetails.hall.name}
          </p>
          <div
            className={
              selectedSeats.length > 0
                ? `border-t border-gray-700 pt-4 `
                : "hidden"
            }
          >
            <p className="text-gray-300">
              <strong>Selected Seats:</strong>{" "}
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </p>
            <p className="text-gray-300">
              <strong>Total Price:</strong> {selectedSeats.length * 150} THB
            </p>
          </div>
          <button
            className={`${
              selectedSeats.length > 0
                ? buttonStyleEnabled
                : buttonStyleDisabled
            } mt-10 ${
              selectedSeats.length > 0
                ? `border-t border-gray-700 pt-4 `
                : "hidden"
            }`}
            disabled={selectedSeats.length === 0}
            onClick={handleSubmit}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
