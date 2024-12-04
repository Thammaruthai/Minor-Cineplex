import { useState, useEffect } from "react";
import axios from "axios";

export default function AddShow() {
  const [formData, setFormData] = useState({
    movieId: "",
    cityId: "",
    cinemaId: "",
    hallId: "",
    showDateTime: "",
  });

  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [halls, setHalls] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch cities to populate dropdown
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/cities");
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch movies to populate dropdown
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Fetch cinemas when a city is selected
  useEffect(() => {
    if (!formData.cityId) return;

    const fetchCinemas = async () => {
      try {
        const response = await axios.get(
          `/api/cinemas?cityId=${formData.cityId}`
        );
        setCinemas(response.data);
      } catch (error) {
        console.error("Failed to fetch cinemas:", error);
      }
    };
    fetchCinemas();
  }, [formData.cityId]);

  // Fetch halls when a cinema is selected
  useEffect(() => {
    if (!formData.cinemaId) return;

    const fetchHalls = async () => {
      try {
        const response = await axios.get(
          `/api/halls?cinemaId=${formData.cinemaId}`
        );
        setHalls(response.data);
      } catch (error) {
        console.error("Failed to fetch halls:", error);
      }
    };
    fetchHalls();
  }, [formData.cinemaId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/add-show", {
        movieId: formData.movieId,
        hallId: formData.hallId,
        showDateTime: formData.showDateTime,
      });

      setMessage(response.data.message);
      setError("");
      setFormData({
        movieId: "",
        cityId: "",
        cinemaId: "",
        hallId: "",
        showDateTime: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred while adding the show."
      );
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-[#070C1B] px-4 text-white">
      <div className="w-full max-w-lg bg-[#070C1B] rounded-lg">
        <h1 className="text-4xl text-center font-bold mb-6">Add Show</h1>
        <form onSubmit={handleSubmit}>
          {/* Select City */}
          <div className="flex flex-col gap-1 mb-4">
            <label
              htmlFor="cityId"
              className="text-sm font-medium text-gray-400"
            >
              Select City
            </label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-[#21263F] py-2 px-4 rounded text-sm text-white"
              required
            >
              <option value="" disabled>
                -- Select a City --
              </option>
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Cinema */}
          {formData.cityId && (
            <div className="flex flex-col gap-1 mb-4">
              <label
                htmlFor="cinemaId"
                className="text-sm font-medium text-gray-400"
              >
                Select Cinema
              </label>
              <select
                name="cinemaId"
                value={formData.cinemaId}
                onChange={handleChange}
                className="w-full border border-gray-700 bg-[#21263F] py-2 px-4 rounded text-sm text-white"
                required
              >
                <option value="" disabled>
                  -- Select a Cinema --
                </option>
                {cinemas.map((cinema) => (
                  <option key={cinema.cinema_id} value={cinema.cinema_id}>
                    {cinema.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Select Hall */}
          {formData.cinemaId && (
            <div className="flex flex-col gap-1 mb-4">
              <label
                htmlFor="hallId"
                className="text-sm font-medium text-gray-400"
              >
                Select Hall
              </label>
              <select
                name="hallId"
                value={formData.hallId}
                onChange={handleChange}
                className="w-full border border-gray-700 bg-[#21263F] py-2 px-4 rounded text-sm text-white"
                required
              >
                <option value="" disabled>
                  -- Select a Hall --
                </option>
                {halls.map((hall) => (
                  <option key={hall.hall_id} value={hall.hall_id}>
                    {hall.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Select Movie */}
          <div className="flex flex-col gap-1 mb-4">
            <label
              htmlFor="movieId"
              className="text-sm font-medium text-gray-400"
            >
              Select Movie
            </label>
            <select
              name="movieId"
              value={formData.movieId}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-[#21263F] py-2 px-4 rounded text-sm text-white"
              required
            >
              <option value="" disabled>
                -- Select a Movie --
              </option>
              {movies.map((movie) => (
                <option key={movie.movie_id} value={movie.movie_id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          {/* Show Date and Time */}
          <div className="flex flex-col gap-1 mb-4">
            <label
              htmlFor="showDateTime"
              className="text-sm font-medium text-gray-400"
            >
              Show Date and Time (yyyy-MM-dd HH:mm)
            </label>
            <input
              type="datetime-local"
              name="showDateTime"
              value={formData.showDateTime}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-[#21263F] py-2 px-4 rounded text-sm text-white"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4E7BEE] py-2 text-sm font-semibold rounded mt-4"
          >
            Add Show
          </button>

          {/* Messages */}
          {message && (
            <p className="text-green-400 text-center mt-4">{message}</p>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}
