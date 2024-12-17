import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const SeatSelectionPage = () => {
  const router = useRouter();
  const { show_id } = router.query;

  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading, please wait.");

  // Animate the loading text
  useEffect(() => {
    if (loading) {
      let dots = "";
      const interval = setInterval(() => {
        dots = dots.length < 3 ? dots + "." : "";
        setLoadingText(`Loading, please wait${dots}`);
      }, 200); // Update every 500ms
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [loading]);


  useEffect(() => {
    if (!show_id) return;

    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/showbooking/showfetch", {
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

  const toggleSeatSelection = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
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
console.log(showDetails.seats);
  return (
    <div className="bg-[#070C1B] text-white min-h-screen p-6">
      {/* Steps Header */}
      <div className="flex justify-center items-center mb-8">
        <div className="flex gap-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              1
            </div>
            <span className="ml-2 text-gray-300">Select Showtime</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              2
            </div>
            <span className="ml-2 text-gray-300">Select Seat</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
              3
            </div>
            <span className="ml-2 text-gray-400">Payment</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Seat Map */}
        <div className="flex-grow bg-[#1A1D3A] p-6 rounded-lg">
          <h2 className="text-center text-xl font-semibold mb-4">Screen</h2>
          <div className="flex flex-col items-center gap-4">
            
            {                       
            showDetails.seats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.seat_id);
              
              
              return (
                <button
                  key={seat.seat_id}
                  className={`w-10 h-10 rounded ${
                    isSelected
                      ? "bg-green-500"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  onClick={() => toggleSeatSelection(seat.seat_id)}
                >
                  {seat.seat_row}
                  {seat.seat_number}
                </button>
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
        <div className="w-full lg:w-1/3 bg-[#1A1D3A] p-6 rounded-lg">
          <img
            src={showDetails.movie.poster}
            alt={showDetails.movie.title}
            className="w-full rounded mb-4"
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
          <div className="border-t border-gray-700 pt-4">
            <p className="text-gray-300">
              <strong>Selected Seats:</strong>{" "}
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </p>
            <p className="text-gray-300">
              <strong>Total Price:</strong> {selectedSeats.length * 150} THB
            </p>
          </div>
          <button
            className="mt-6 bg-blue-500 w-full py-3 rounded text-white hover:bg-blue-600"
            disabled={selectedSeats.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
