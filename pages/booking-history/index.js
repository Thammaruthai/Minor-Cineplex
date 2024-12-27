import BookingHistory from "@/Components/booking-history/history-list";
import { formatedDate, formatShowtime } from "@/utils/date";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-start p-6">
      <BookingHistory  />
    </div>
  );
}
