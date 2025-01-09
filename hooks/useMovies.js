import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useMovie() {
  const router = useRouter();
  const { movieId } = router.query;
  const [movie, setMovie] = useState([]);
  const [city, setCity] = useState("All");
  const [cinema, setCinema] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toDateString());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams({ movieId, city, cinema });
        const response = await axios.get(
          city === "All"
            ? `/api/movies/${movieId}`
            : `/api/movies/${movieId}?city=${city}&cinema=${cinema}`
        );
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
    if (movieId) {
      fetchData();
    }
  }, [movieId, date]);

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
