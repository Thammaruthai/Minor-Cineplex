import axios from "axios";
import { useState, useEffect, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Filter() {
  const [movies, setMovies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [cities, setCities] = useState([]);
  const [releaseDate, setReleaseDate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    movie: "",
    language: "",
    genre: "",
    city: "",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // ควบคุมการเปิด-ปิดปฏิทิน
  const datePickerRef = useRef();

  // Fetch Filters Data
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const response = await axios.get("/api/filterAndMovieCard");
        const data = response.data;
        setMovies(data.movies || []);
        setLanguages(data.languages || []);
        setGenres(data.genres || []);
        setCities(data.cities || []);
      } catch (error) {
        console.error("Failed to fetch filters data:", error);
      }
    };

    fetchFiltersData();
  }, []);

  // Handle clicks outside of the date picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = async () => {
    const formattedDate = releaseDate
      ? releaseDate.toISOString().split("T")[0]
      : null;

    const filters = {
      ...selectedFilters,
      releaseDate: formattedDate,
    };

    console.log("Filters applied:", filters);

    try {
      const response = await axios.post("/api/filterMovie", filters);
      console.log("Filtered Movies:", response.data);
    } catch (error) {
      console.error("Failed to fetch filtered movies:", error);
    }
  };

  return (
    <section className="bg-[#070C1B] mx-5 rounded-2xl shadow-lg -mt-40 lg:-mt-12 lg:mx-20">
      <div className="p-5 rounded-lg mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
          {/* Movie Dropdown */}
          <div className="mb-4 lg:mb-0 lg:flex-1">
            <select
              className="w-full border border-[#565f7e] p-2 py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none"
              value={selectedFilters.movie}
              onChange={(e) => handleFilterChange("movie", e.target.value)}
            >
              <option value="">Movie</option>
              {movies.map((movie) => (
                <option key={movie.movie_id} value={movie.movie_id}>
                  {movie.title}
                </option>
              ))}
            </select>
          </div>

          {/* Language and Genre */}
          <div className="flex gap-4 mb-4 lg:mb-0 lg:flex-row lg:flex-1 lg:gap-4">
            <select
              className="flex-1 p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none"
              value={selectedFilters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
            >
              <option value="">Language</option>
              {languages.map((language) => (
                <option key={language.language_id} value={language.language_id}>
                  {language.name}
                </option>
              ))}
            </select>

            <select
              className="flex-1 p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none"
              value={selectedFilters.genre}
              onChange={(e) => handleFilterChange("genre", e.target.value)}
            >
              <option value="">Genre</option>
              {genres.map((genre) => (
                <option key={genre.genre_id} value={genre.genre_id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* City and Release Date */}
          <div className="flex gap-4 mb-4 lg:mb-0 lg:flex-row lg:flex-1 lg:gap-4">
            <div className="flex-1">
              <select
                className="w-full p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none"
                value={selectedFilters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <option value="">City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Date */}
            <div className="flex-1 relative">
              {/* Dropdown Select */}
              <select
                className="w-full p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none appearance-none pr-10"
                value={
                  releaseDate ? releaseDate.toISOString().split("T")[0] : ""
                }
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} // เปิด-ปิดปฏิทินเมื่อคลิก
                readOnly // ป้องกันการแก้ไขค่าใน select
              >
                <option value="">
                  {releaseDate
                    ? releaseDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Release Date"}
                </option>
              </select>

              {/* Icon รูปปฏิทิน */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                <img
                  src="/img/Date_today_light.png"
                  alt="Calendar Icon"
                  className="h-5 w-5"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} // เปิด-ปิดปฏิทิน
                />
              </span>

              {/* DatePicker */}
              {isDatePickerOpen && (
                <div
                  ref={datePickerRef}
                  className="absolute top-full mt-2 z-50 bg-[#21263f] text-white rounded-lg shadow-lg"
                >
                  <ReactDatePicker
                    selected={releaseDate}
                    onChange={(date) => {
                      setReleaseDate(date); // อัปเดตวันที่เมื่อเลือก
                      setIsDatePickerOpen(false); // ปิดปฏิทิน
                    }}
                    inline
                  />
                </div>
              )}
            </div>
          </div>
          {/* Search Button */}
          <div className="flex justify-center lg:flex-none lg:ml-4">
            <button
              className="w-20 h-14 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex justify-center items-center"
              onClick={handleSearch}
            >
              <img src="/img/Search_light.png" alt="search" className="h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
