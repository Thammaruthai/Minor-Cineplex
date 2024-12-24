import axios from "axios";
import { useState, useEffect, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFilter } from "@/hooks/useFilter";
import { useRouter } from "next/router";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { formatDateToLocal } from "@/utils/date";

export function FilterBar() {
  const [movies, setMovies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [cities, setCities] = useState([]);
  const [filterDate, setFilterDate] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    movie: "",
    language: "",
    genre: "",
    city: "",
    date: "",
    feature: "",
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef();
  const router = useRouter();
  const { movie, language, date, genre, city, feature } = useFilter();

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
    const filters = {
      movie: selectedFilters.movie || "",
      language: selectedFilters.language || "",
      genre: selectedFilters.genre || "",
      city: selectedFilters.city || "",
      date: formatDateToLocal(filterDate),
    };

    const queryParams = new URLSearchParams(filters);

    // Handle multiple features
    if (Array.isArray(selectedFilters.feature)) {
      selectedFilters.feature.forEach((feature) =>
        queryParams.append("feature", feature)
      );
    } else if (selectedFilters.feature) {
      queryParams.append("feature", selectedFilters.feature);
    }

    router.push(`/search-results?${queryParams.toString()}`);
  };

  const handleClear = () => {
    setSelectedFilters({
      movie: "",
      language: "",
      genre: "",
      city: "",
      date: "",
      feature: [],
    });
    setFilterDate(null);
  };

  useEffect(() => {
    setSelectedFilters({
      movie: movie || "",
      language: language || "",
      genre: genre || "",
      city: city || "",
      date: formatDateToLocal(filterDate) || "",
      feature: Array.isArray(feature)
        ? feature
        : feature
        ? feature.split(",")
        : [],
    });
    if (date) {
      setFilterDate(new Date(date));
    }
  }, [router.query]);

  const handleFeatureChange = (feature) => {
    setSelectedFilters((prev) => {
      const currentFeatures = Array.isArray(prev.feature)
        ? prev.feature
        : prev.feature
        ? [prev.feature]
        : [];
      const updatedFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature];
      return {
        ...prev,
        feature: updatedFeatures,
      };
    });
  };

  return (
    <div className="bg-[#070C1B] gap-6 rounded-2xl shadow-lg lg:h-[300px] w-full flex flex-col justify-center items-center -mt-20 relative z-10">
      <div className="rounded-lg mt-20 xl:w-[1200px]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
          {/* Movie Dropdown */}
          <div className="mb-4 lg:mb-0 lg:flex-1 lg:max-w-[267px] relative">
            <select
              className="w-full border border-[#565f7e] p-2 py-4 bg-[#21263f] text-[#8b93b0] rounded focus:outline-none appearance-none cursor-pointer"
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
              className="w-6 h-6 absolute top-4 right-3 pointer-events-none"
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
            <div className="lg:min-w-[190.25px] relative">
              <select
                className="flex-1 p-2 appearance-none border border-[#565f7e] w-full py-4 bg-[#21263f] text-[#8b93b0] rounded focus:outline-none cursor-pointer"
                value={selectedFilters.language}
                onChange={(e) => handleFilterChange("language", e.target.value)}
              >
                <option value="">Any language</option>
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
                className="w-6 h-6 absolute top-4 right-3 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <div className="lg:min-w-[190.25px] relative">
              <select
                className="flex-1 w-full p-2 border border-[#565f7e] py-4 lg:max-w-[197.25px] bg-[#21263f] text-[#8b93b0] rounded focus:outline-none cursor-pointer appearance-none"
                value={selectedFilters.genre}
                onChange={(e) => handleFilterChange("genre", e.target.value)}
              >
                <option value="">All Genre</option>
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
                className="w-6 h-6 absolute top-4 right-3 pointer-events-none"
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
            <div className="lg:min-w-[190.25px] relative">
              <select
                className="flex-1 p-2 border w-full border-[#565f7e] lg:max-w-[189.25px] py-4 bg-[#21263f] text-[#8b93b0] rounded focus:outline-none cursor-pointer appearance-none"
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
                className="w-6 h-6 absolute top-4 right-3 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
            <div className="flex-1 relative z-40">
              <button
                className="w-full h-[58px] px-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] rounded focus:outline-none text-start"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                {filterDate ? formatDateToLocal(filterDate) : "All Date"}
              </button>
              {isDatePickerOpen && (
                <div
                  ref={datePickerRef}
                  className="absolute z-50 top-full mt-1 bg-[#21263f] text-white rounded-lg shadow-lg"
                >
                  <ReactDatePicker
                    selected={filterDate}
                    onChange={(date) => {
                      setFilterDate(date);
                      setIsDatePickerOpen(false);
                    }}
                    inline
                  />
                </div>
              )}
              <Image
                src="/img/Date_today_light.png"
                width={18}
                height={15}
                alt="Calendar"
                className="z-40 absolute top-1/3 right-3 pointer-events-none"
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
      <div className="flex justify-between xl:min-w-[1200px] items-center">
        <div className="flex items-center justify-center gap-6 text-[#C8CEDD]">
          <Checkbox
            checked={
              Array.isArray(selectedFilters.feature) &&
              selectedFilters.feature.includes("Wheelchair Access")
            }
            onCheckedChange={() => handleFeatureChange("Wheelchair Access")}
          >
            Wheelchair Access
          </Checkbox>
          <Checkbox
            checked={
              Array.isArray(selectedFilters.feature) &&
              selectedFilters.feature.includes("Hearing Assistance")
            }
            onCheckedChange={() => handleFeatureChange("Hearing Assistance")}
          >
            Hearing Assistance
          </Checkbox>
        </div>
        <div>
          <p onClick={handleClear} className="underline cursor-pointer">
            Clear
          </p>
        </div>
      </div>
    </div>
  );
}
