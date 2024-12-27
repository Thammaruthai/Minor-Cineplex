import axios from "axios";
import { useState, useEffect, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Filter({ onFilterApply }) {
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
    date: "",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef();
  const router = useRouter();

  // Fetch filter data
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const response = await axios.get("/api/landing-page/fetch-movie-card");
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
    const formatDateToLocal = (date) => {
      if (!date) return new Date().toDateString();
      const offsetDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return offsetDate.toISOString().split("T")[0];
    };
    const filters = {
      movie: selectedFilters.movie || "",
      language: selectedFilters.language || "",
      genre: selectedFilters.genre || "",
      city: selectedFilters.city || "",
      date: formatDateToLocal(releaseDate),
    };
    const queryParams = new URLSearchParams(filters).toString();
    router.push(`/search-results?${queryParams}`);
  };

  return (
    <section className="bg-[#070C1B] rounded-[4px] shadow-lg -mt-52 w-[344px] md:w-[450px] lg:min-w-[1000px] lg:-mt-12 2xl:w-[1500px] flex justify-center items-center">
      <div className="p-5 xl:p-10 rounded-lg mx-auto xl:h-[128px] flex flex-col justify-center w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
          {/* Movie Dropdown */}
          <div className="mb-4 lg:mb-0 lg:flex-1 relative xl:max-w-[350px] lg:max-w-[250px]">
            <select
              className="w-full appearance-none cursor-pointer border border-[#565f7e] p-2 py-4 bg-[#21263f] text-[#8b93b0] xl:text-xl rounded focus:outline-none"
              value={selectedFilters.movie}
              onChange={(e) => handleFilterChange("movie", e.target.value)}
            >
              <option value="">Movie</option>
              {movies.map((movie) => (
                <option key={movie.movie_id} value={movie.title}>
                  {movie.title}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#C8CEDD"
              className="w-6 h-6 absolute xl:top-5 top-4 right-3 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>

          {/* Language, Genre Dropdowns */}
          <div className="flex gap-4 mb-4 lg:mb-0 lg:flex-row lg:flex-1 lg:gap-4">
            <div className="w-full relative">
              <select
                className="flex-1 w-full cursor-pointer appearance-none p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] xl:text-xl rounded focus:outline-none"
                value={selectedFilters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
              >
                <option value="">Language</option>
                {languages.map((language) => (
                  <option key={language.language_id} value={language.language}>
                    {language.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#C8CEDD"
                className="w-6 h-6 absolute xl:top-5 top-4 right-3 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <div className="w-full relative">
              <select
                className="flex-1 w-full cursor-pointer appearance-none p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] xl:text-xl rounded focus:outline-none"
                value={selectedFilters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
              >
                <option value="">Genre</option>
                {genres.map((genre) => (
                  <option key={genre.genre_id} value={genre.genre}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#C8CEDD"
                className="w-6 h-6 absolute xl:top-5 top-4 right-3 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>

          {/* City Dropdown and Release Date Picker */}
          <div className="flex gap-4 mb-4 lg:mb-0 lg:flex-row lg:flex-1 lg:gap-4">
            <div className="2xl:min-w-[221px] min-w-[144px] lg:min-w-[133px] md:min-w-[197px] relative">
              <select
                className="flex-1 w-full cursor-pointer appearance-none p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] xl:text-xl rounded focus:outline-none"
                value={selectedFilters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <option value="">City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#C8CEDD"
                className="w-6 h-6 absolute xl:top-5 top-4 right-3 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <div className="flex-1 relative z-0">
              <select
                className="absolute w-full p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] xl:text-xl lg:text-[15px] rounded focus:outline-none appearance-none pr-10"
                value={
                  releaseDate ? releaseDate.toISOString().split("T")[0] : ""
                }
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                readOnly
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
              {isDatePickerOpen && (
                <div
                  ref={datePickerRef}
                  className="absolute top-full mt-2 z-50 bg-[#21263f] text-white rounded-lg shadow-lg"
                >
                  <ReactDatePicker
                    selected={releaseDate}
                    onChange={(date) => {
                      setReleaseDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    inline
                  />
                </div>
              )}
              <Image
                src="/img/Date_today_light.png"
                width={24}
                height={24}
                alt="Calendar"
                className="z-40 absolute xl:top-5 top-4 right-3 pointer-events-none"
              />
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
