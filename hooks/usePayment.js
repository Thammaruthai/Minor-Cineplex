import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function usePayment() {
  const router = useRouter();
  const { payment_uuid } = router.query;
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/payment/booking-success/${payment_uuid}`
        );

        setPayment(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    };

    if (payment.length === 0) {
      setLoading(false);
    }
    if (payment_uuid) {
      fetchData();
    }
  }, [payment_uuid]);

  console.log(`Payment:`, payment)
  return {
    payment,
    loading,
    setPayment,
    setLoading,
  };
}
