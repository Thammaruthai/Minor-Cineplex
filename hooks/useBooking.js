import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useBooking() {
  const router = useRouter();
  const { booking_uuid } = router.query;
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/payment/booking-summary/${booking_uuid}`
        );
        if (response.status === 200) {
          setBooking(response.data.data);
          setTimeLeft(response.data.remaining_time)
          setIsError(false)
        } 
        
      } catch (error) {
        console.log(error);
        setIsError(true)
      } finally {
        setLoading(false);
      }
    };

    if (booking.length === 0) {
      setLoading(false);
    }
    if (booking_uuid) {
      fetchData();
    }
  }, [booking_uuid]);

  return {
    booking,
    loading,
    timeLeft,
    isError,
    setBooking,
    setLoading,
    setTimeLeft,
  };
}
