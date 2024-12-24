import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export function useFilter() {
  const router = useRouter();
  const { movie, language, genre, city, date, feature } = router.query;
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Convert feature string to multiple query parameters
        const featureParams = Array.isArray(feature)
          ? feature.map((f) => `feature=${encodeURIComponent(f)}`).join("&")
          : feature
          ? `feature=${encodeURIComponent(feature)}`
          : "";

        const queryString = `/api/landing-page/filter-movie?movie=${
          movie || ""
        }&language=${language || ""}&genre=${genre || ""}&city=${
          city || ""
        }&date=${date || ""}&${featureParams}&page=${page}&limit=3`;

        const response = await axios.get(queryString);
        setResults(response.data.results);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) fetchResults();
  }, [router.isReady, movie, language, genre, city, date, feature, page]);

  return {
    results,
    loading,
    movie,
    language,
    genre,
    city,
    date,
    feature,
    page,
    setResults,
    setLoading,
    setPage,
  };
}
