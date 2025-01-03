import BookingHistory from "@/Components/booking-history/booking-history";
import { formatedDate, formatShowtime } from "@/utils/date";

const mockBookings = [
  {
    poster: "https://via.placeholder.com/80x120",
    movieTitle: "The Dark Knight",
    cinemaName: "Minor Cineplex Arkham",
    date: "24 Jun 2024",
    time: "16:30",
    hall: "Hall 1",
    ticketCount: 2,
    seats: ["C9", "C10"],
    paymentMethod: "Credit card",
    status: "Paid",
  },
  {
    poster: "https://via.placeholder.com/80x120",
    movieTitle: "Dune: Part Two",
    cinemaName: "Minor Cineplex Arkham",
    date: "25 Jun 2024",
    time: "13:00",
    hall: "Hall 4",
    ticketCount: 4,
    seats: ["A1", "A2", "A3", "A4"],
    paymentMethod: "Credit card",
    status: "Paid",
  },
  {
    poster: "https://via.placeholder.com/80x120",
    movieTitle: "Interstellar",
    cinemaName: "Minor Cineplex Arkham",
    date: "22 Jun 2024",
    time: "16:30",
    hall: "Hall 1",
    ticketCount: 1,
    seats: ["D5"],
    paymentMethod: "Credit card",
    status: "Completed",
  },
  {
    poster: "https://via.placeholder.com/80x120",
    movieTitle: "Django Unchained",
    cinemaName: "Minor Cineplex Arkham",
    date: "20 Jun 2024",
    time: "14:30",
    hall: "Hall 8",
    ticketCount: 2,
    seats: ["C9", "C10"],
    paymentMethod: "Credit card",
    status: "Canceled",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
      <BookingHistory bookings={mockBookings} />
    </div>
  );
}
