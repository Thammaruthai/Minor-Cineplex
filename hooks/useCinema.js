import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useCinema() {
  const router = useRouter();
  const { cinemaId } = router.query;
  const [movie, setMovie] = useState([]);
  const [city, setCity] = useState("All");
  const [cinema, setCinema] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toDateString());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({ cinemaId });
        const response = await axios.get(`/api/cinemas/${cinemaId}`);
        setMovie(response.data.data);

      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movie.length === 0) {
      setLoading(false);
    }
    if (cinemaId) {
      fetchData();
    }
  }, [cinemaId, date]);
  console.log(`data from useCinema`, movie)
  return {
    movie,
    city,
    cinema,
    date,
    inputSearch,
    loading,
    setMovie,
    setCity,
    setCinema,
    setDate,
    setInputSearch,
    setLoading,
  };
}
