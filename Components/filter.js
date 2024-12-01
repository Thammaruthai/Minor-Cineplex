import { useState, useEffect } from "react";

export default function Filter() {
  const [movies, setMovies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    movie: "",
    language: "",
    genre: "",
    city: "",
  });

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const response = await fetch("/api/filterMovie");
        const data = await response.json();
        console.log("API Data:", data); // Debug ข้อมูลจาก API
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

  // ฟังก์ชันกรองค่าซ้ำ
  const getUniqueItems = (items, key) => {
    return Array.from(new Set(items.map((item) => item[key]))).map(
      (uniqueKey) => items.find((item) => item[key] === uniqueKey)
    );
  };

  // สร้างรายการหนังที่ไม่ซ้ำ
  const uniqueMovies = getUniqueItems(movies, "movie_name");
  console.log("Unique Movies:", uniqueMovies); // Debug รายการหนัง

  // ฟังก์ชัน handle การเปลี่ยนค่าของ dropdown
  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ฟังก์ชัน handle การค้นหา
  const handleSearch = () => {
    console.log("Filters applied:", selectedFilters);
    // ทำการ fetch หรือกรองข้อมูลตามค่าที่เลือก
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
              {uniqueMovies.map((movie) => (
                <option key={movie.movie_id} value={movie.movie_id}>
                  {movie.movie_name}
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
              {languages && languages.length > 0
                ? languages.map((language) => (
                    <option
                      key={language.language_id}
                      value={language.language_id}
                    >
                      {language.name}
                    </option>
                  ))
                : null}
            </select>

            <select
              className="flex-1 p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none"
              value={selectedFilters.genre}
              onChange={(e) => handleFilterChange("genre", e.target.value)}
            >
              <option value="">Genre</option>
              {genres && genres.length > 0
                ? genres.map((genre) => (
                    <option key={genre.genre_id} value={genre.genre_id}>
                      {genre.name}
                    </option>
                  ))
                : null}
            </select>
          </div>

          {/* City */}
          <div className="flex gap-4 mb-4 lg:mb-0 lg:flex-row lg:flex-1 lg:gap-4">
            <div className="flex-1">
              <select
                className="w-full p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none"
                value={selectedFilters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              >
                <option value="">City</option>
                {cities && cities.length > 0
                  ? cities.map((city) => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.name}
                      </option>
                    ))
                  : null}
              </select>
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
