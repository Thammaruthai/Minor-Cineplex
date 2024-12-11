import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function MoviesCard() {
  const [nowShowing, setNowShowing] = useState([]); // หนังที่กำลังฉาย
  const [comingSoon, setComingSoon] = useState([]); // หนังที่กำลังจะมา
  const [isNowShowing, setIsNowShowing] = useState(true); // สถานะตอนนี้

  // ฟังก์ชันกรองค่าซ้ำ
  const getUniqueMovies = (movies) => {
    const uniqueMap = new Map();
    movies.forEach((movie) => {
      uniqueMap.set(movie.movie_id, movie);
    });
    return Array.from(uniqueMap.values());
  };

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/api/landing-page/fetch-movie-card");
        const data = response.data; // ดึงข้อมูลจาก response
        console.log(data.movies);

        // จัดเรียงหนังตามวันที่
        const sortedMovies = data.movies.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );

        // กรองหนังที่ซ้ำกัน
        const uniqueMovies = getUniqueMovies(sortedMovies);

        // แยกข้อมูลหนังเป็น "Now Showing" และ "Coming Soon"
        setNowShowing(uniqueMovies.slice(0, 4)); // 4 เรื่องแรก
        setComingSoon(uniqueMovies.slice(4)); // เรื่องที่เหลือ
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []); // ดึงข้อมูลครั้งแรกเมื่อคอมโพเนนต์โหลด

  return (
    <>
      {/* Header */}
      <div className="py-5 mx-5 mb-8 mt-16 lg:mt-24 lg:mx-20">
        <button
          className={`${
            isNowShowing ? "text-white " : "text-[#8b93b0]"
          } pb-2 text-2xl lg:text-4xl font-bold`}
          onClick={() => setIsNowShowing(true)} // สลับเป็น "Now Showing"
        >
          Now showing
        </button>
        <button
          className={`${
            !isNowShowing ? "text-white " : "text-[#8b93b0]"
          } text-2xl font-bold px-5 lg:text-4xl`}
          onClick={() => setIsNowShowing(false)} // สลับเป็น "Coming Soon"
        >
          Coming soon
        </button>
      </div>

      {/* Content */}
      <div className="mx-5 mb-10 grid grid-cols-2 gap-6  lg:grid-cols-4 lg:mx-20">
        {(isNowShowing ? nowShowing : comingSoon).map((movie) => (
          <div key={movie.movie_id} className="flex flex-col">
            <Link href={`/movies/${movie.movie_id}`}>
            <div>
              <img
                src={movie.poster || "https://via.placeholder.com/300x400"}
                className="rounded-lg w-full h-[310px] sm:h-[430px] md:h-[500px] xl:h-[480px]  lg:h-[300px] 2xl:h-[550px]"
                alt={movie.title}
              />
            </div>
            </Link>
            <div className="flex items-center justify-between pt-4">
              <span className="text-[#8b93b0] text-base xl:text-xl">
                {new Date(movie.release_date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <div className="flex items-center">
                <img
                  src="/img/Star_fill.png"
                  className="Rating-Star w-3 h-3"
                  alt="Rating"
                />
                <span className="text-[#8b93b0] pl-2 text-base 2xl:text-xl">
                  {movie.rating > 0 ? movie.rating.toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
            <Link href={`/movies/${movie.movie_id}`}>
              <div>
                <p className="text-white text-xl lg:text-2xl xl:text-3xl font-bold pt-1">
                  {movie.title}
                </p>
              </div>
            </Link>

            {/* Genres and Languages */}
            <div className="flex gap-2 pt-3 flex-wrap">
              {movie.genre_names &&
                movie.genre_names.split(", ").map((genre, index) => (
                  <button
                    key={index}
                    className="text-[#8b93b0] p-2 px-4 bg-[#2a304f] rounded-md"
                  >
                    {genre}
                  </button>
                ))}
              {movie.language_names &&
                movie.language_names.split(", ").map((lang, index) => (
                  <button
                    key={index}
                    className="text-[#c8cedd] p-2 px-4 bg-[#2a304f] rounded-md"
                  >
                    {lang}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
