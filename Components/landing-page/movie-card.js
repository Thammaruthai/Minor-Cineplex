import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Button } from "@/components/ui/button";

export default function MoviesCard() {
  const [nowShowing, setNowShowing] = useState([]); // หนังที่กำลังฉาย
  const [comingSoon, setComingSoon] = useState([]); // หนังที่กำลังจะมา
  const [isNowShowing, setIsNowShowing] = useState(true); // สถานะตอนนี้
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/landing-page/fetch-movie-card", {
          params: { page },
        });
        const data = response.data; // ดึงข้อมูลจาก response

        // จัดเรียงหนังตามวันที่
        const sortedMovies = data.movies.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );

        // กรองหนังที่ซ้ำกัน
        // แยกข้อมูลหนังเป็น "Now Showing" และ "Coming Soon"
        const uniqueMovies = Array.from(
          new Map(sortedMovies.map((movie) => [movie.movie_id, movie])).values()
        );
        if (page === 1) {
          setNowShowing(uniqueMovies.slice(0, 4));
          setComingSoon(uniqueMovies.slice(4, 12)); // Initial 8 movies for Coming Soon
        } else {
          setComingSoon((prev) => {
            const existingMovieIds = new Set(
              prev.map((movie) => movie.movie_id)
            );
            const newMovies = uniqueMovies.filter(
              (movie) => !existingMovieIds.has(movie.movie_id)
            );
            return [...prev, ...newMovies];
          });
        }

        if (data.currentPage >= data.totalPages) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (page === 1) {
      setComingSoon([]);
    }
    fetchMovies();
  }, [page]); // ดึงข้อมูลครั้งแรกเมื่อคอมโพเนนต์โหลด

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {/* Header */}
      <section className="flex flex-col w-full max-w-[1500px] md:mb-5 lg:mb-10 2xl:p-0">
        <div className=" py-5 xl:mb-8 mt-16 lg:mt-24 flex w-full gap-5 items-center">
          <button
            className={`${
              isNowShowing
                ? "text-white border-b border-[#565F7E]"
                : "text-[#8b93b0]"
            } pb-1 text-2xl lg:text-4xl font-bold`}
            onClick={() => setIsNowShowing(true)} // สลับเป็น "Now Showing"
          >
            Now showing
          </button>
          <button
            className={`${
              !isNowShowing
                ? "text-white border-b border-[#565F7E] "
                : "text-[#8b93b0]"
            } pb-1 text-2xl font-bold lg:text-4xl`}
            onClick={() => setIsNowShowing(false)} // สลับเป็น "Coming Soon"
          >
            Coming soon
          </button>
        </div>

        {/* Content */}
        <div className=" mb-10 xl:p-0 grid grid-cols-2 xl:gap-6 gap-5 lg:grid-cols-4">
          {(isNowShowing ? nowShowing : comingSoon).map((movie) => (
            <div key={movie.movie_id} className="flex flex-col">
              <Link href={`/movies/${movie.movie_id}`}>
                <div>
                  <img
                    src={movie.poster || "https://via.placeholder.com/300x400"}
                    className="rounded-[4px] w-full h-[235px] sm:h-[430px] md:h-[500px] xl:h-[480px] lg:h-[300px]"
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
                    {movie?.avg_rating > 0
                      ? movie?.avg_rating?.toFixed(1)
                      : "N/A"}
                  </span>
                </div>
              </div>
              <Link href={`/movies/${movie.movie_id}`}>
                <div>
                  <p className="text-white text-lg lg:text-2xl xl:text-3xl font-bold pt-1">
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
                      className="text-[#8b93b0] p-2 xl:px-4 bg-[#2a304f] rounded-md"
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
        {!isNowShowing && hasMore && (
          <div className="flex justify-center items-center w-full">
            {loading ? (
              <Box sx={{ width: "100%" }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    backgroundColor: "#8B93B0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "white", 
                    },
                  }}
                />
              </Box>
            ) : (
              <Button
                onClick={handleLoadMore}
                className="text-white px-10 border h-14 text-lg border-[#21263F] font-bold mt-5 cursor-pointer hover:border-[#8B93B0]"
              >
                LOAD MORE
              </Button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
