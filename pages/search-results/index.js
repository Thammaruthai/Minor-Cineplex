import { useEffect, useState } from "react";
import Image from "next/image";
import {
  formatShowtime,
  classifyShowtime,
  getNextShowtime,
} from "@/utils/date";
import { groupByCinema, groupByHall, groupByMovie } from "@/utils/grouping";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import { SelectRoot, SelectTrigger } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useFilter } from "@/hooks/useFilter";
import FilterBar from "./filterbar";

function SearchResults() {
  const { results, loading, date, genre } = useFilter();

  useEffect(() => {
    console.log("Updated results:", results);
  }, [results]);

  const [isShowHall, setIsShowHall] = useState(() => {
    const initialState = {};
    results?.forEach((show) => {
      initialState[show.cinema_name] = true; // Make all cinemas visible initially
    });
    return initialState;
  });

  useEffect(() => {
    if (results) {
      const initialState = {};
      results.forEach((show) => {
        initialState[show.cinema_name] = true; // Set all cinemas as visible
      });
      setIsShowHall(initialState);
    }
  }, [results]);

  const handleShowHall = (cinema_name) => {
    setIsShowHall((prev) => ({
      ...prev,
      [cinema_name]: !prev[cinema_name],
    }));
  };
  const cinemas = groupByCinema(results, date);
  const movies = groupByMovie(results, date);

  const filteredCinemas = Object.entries(cinemas)
    .map(([cinema_name, shows]) => {
      const filteredShows = shows.filter((show) => {
        const showDate = new Date(show.show_date_time).toDateString();
        const selectedDate = new Date(date).toDateString();
        return showDate === selectedDate;
      });

      return filteredShows.length > 0 ? [cinema_name, filteredShows] : null;
    })
    .filter(Boolean);

  const cinemaNames = filteredCinemas.map(([cinema_name]) => cinema_name);

  const filteredMovies = Object.entries(movies)
    .map(([movieName, movieDetails]) => {
      const filteredDetails = movieDetails.filter((detail) => {
        const showDate = detail.show_date_time
          ? new Date(detail.show_date_time).toDateString()
          : null;
        const selectedDate = new Date(date).toDateString();
        return (
          showDate === selectedDate && cinemaNames.includes(detail.cinema_name)
        );
      });
      return filteredDetails.length > 0 ? [movieName, filteredDetails] : null;
    })
    .filter(Boolean);

  return (
    <section className="w-full h-full flex flex-col items-center text-white my-7 gap-10">
      <FilterBar />
      <div className="md:max-w-[1200px] w-full flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center items-center gap-3">
            <div>
              <ProgressCircleRoot value={null} size="sm">
                <ProgressCircleRing cap="round" />
              </ProgressCircleRoot>
            </div>
            <p>Loading...</p>
          </div>
        ) : filteredCinemas.length > 0 ? (
          filteredCinemas.map(([cinema_name, shows]) => {
            const relatedMovies = filteredMovies.filter(
              ([movieName, movieDetails]) =>
                movieDetails.some(
                  (detail) =>
                    detail.cinema_name === cinema_name &&
                    new Date(detail.show_date_time).toDateString() ===
                      new Date(date).toDateString()
                )
            );
            return relatedMovies.length > 0 ? (
              <div
                key={cinema_name}
                className="selectCinema flex flex-col w-full"
              >
                <SelectRoot
                  size="sm"
                  className="bg-[#070C1B] p-4 rounded-md w-full md:max-w-[1200px]"
                >
                  <SelectTrigger icon={null}>
                    <div className="flex md:justify-between items-start justify-center md:items-center w-full">
                      <div className="md:flex-row flex flex-col md:items-center gap-5 w-full">
                        <div className="flex items-center gap-5">
                          <Image
                            src="/icon.png"
                            width={44}
                            height={44}
                            alt="Icon"
                          />
                          <h1 className="text-2xl font-bold">{cinema_name}</h1>
                        </div>
                        {[
                          ...new Map(
                            results
                              .filter(
                                (result) =>
                                  result.cinema_feature &&
                                  result.cinema_feature.some(
                                    (feature) => feature !== null
                                  ) &&
                                  result.cinema_name === cinema_name
                              )
                              .map((result) => [result.cinema_name, result]) 
                          ).values(),
                        ].map((uniqueResult) => (
                          <div
                            key={uniqueResult.cinema_name}
                            className="flex gap-5"
                          >
                            {[...new Set(uniqueResult.cinema_feature)].map(
                              (feature, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[#21263F] p-3 py-2 text-[14px] text-[#8B93B0] rounded-md"
                                >
                                  {feature}
                                </div>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                      {isShowHall[cinema_name] ? (
                        <div
                          className="flex items-center"
                          onClick={() => handleShowHall(cinema_name)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="45"
                            height="45"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="gray"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-up"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        </div>
                      ) : (
                        <div
                          className="flex items-center"
                          onClick={() => handleShowHall(cinema_name)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="gray"
                            className="w-10 h-10"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </SelectTrigger>
                </SelectRoot>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    isShowHall[cinema_name]
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="bg-[#070C1B] border-t border-[#21263F] flex flex-col md:gap-14 gap-4 md:p-6 p-4">
                    {relatedMovies.length > 0 ? (
                      relatedMovies.map(([movieName, movieDetails]) => {
                        const movie = movieDetails[0].movies;
                        const hall = groupByHall(movieDetails, date);
                        if (genre && !movie.genres.includes(genre)) {
                          return null;
                        }
                        return (
                          <div
                            key={movieName}
                            className="flex flex-col md:flex-row w-full bg-[#070C1B] rounded-lg lg:min-h-[488px]"
                          >
                            <div className="w-full md:w-60 flex md:flex-col gap-6">
                              <Link href={`/movies/${movie.movieId}`}>
                                <Image
                                  src={movie.poster}
                                  width={174}
                                  height={254}
                                  alt={movie.title}
                                  className="md:h-[254px] md:w-[200px] rounded-md"
                                />
                              </Link>
                              <div className="w-full md:gap-2 flex flex-col gap-6">
                                <Link href={`/movies/${movie.movieId}`}>
                                  <h1 className="text-xl font-bold">
                                    {movieName}
                                  </h1>
                                </Link>
                                <div className="flex flex-wrap gap-2">
                                  {movie.genres.map((genre, index) => (
                                    <Button
                                      key={index}
                                      className="bg-[#21263F] p-4 text-[#C8CEDD]"
                                    >
                                      {genre.trim()}
                                    </Button>
                                  ))}
                                  <Button className="bg-[#21263F] p-4 text-[#C8CEDD]">
                                    {movie.language}
                                  </Button>
                                </div>
                                <div
                                  onClick={() =>
                                    handleShowMovieDetail(movieName)
                                  }
                                  className="underline md:mt-5 cursor-pointer hover:font-bold"
                                >
                                  Movie detail
                                </div>
                              </div>
                            </div>
                            <div className="bg-[#070C1B] flex flex-col md:gap-14 gap-4 md:p-10 p-4 py-6">
                              {Object.entries(hall)
                                .filter(([hall_name, hallShows]) =>
                                  hallShows.some(
                                    (show) =>
                                      show.show_date_time &&
                                      show.cinema_name === cinema_name &&
                                      new Date(
                                        show.show_date_time
                                      ).toDateString() ===
                                        new Date(date).toDateString()
                                  )
                                )
                                .map(([hall_name, shows]) => {
                                  return (
                                    <div
                                      key={hall_name}
                                      className="flex flex-col"
                                    >
                                      <h2 className="text-2xl font-bold text-[#C8CEDD]">
                                        {hall_name}
                                      </h2>
                                      <div className="flex flex-wrap gap-4 mt-4">
                                        {shows
                                          .filter((show) => {
                                            const showDate = new Date(
                                              show.show_date_time
                                            ).toDateString();
                                            const selectedDateStr = new Date(
                                              date
                                            ).toDateString();
                                            return showDate === selectedDateStr;
                                          })
                                          .map((show) => {
                                            const currentTime = new Date();
                                            const currentDate =
                                              currentTime.toDateString();
                                            const selectedDateStr = new Date(
                                              date
                                            ).toDateString();
                                            const showtimeStatus =
                                              classifyShowtime(
                                                show.show_date_time
                                              );
                                            const nextShow =
                                              getNextShowtime(shows, date)
                                                ?.show_id === show.show_id;
                                            const isPastShowtime =
                                              new Date(show.show_date_time) <
                                              new Date();
                                            const buttonColor =
                                              selectedDateStr !== currentDate
                                                ? "bg-[#1E29A8]"
                                                : nextShow
                                                ? "bg-[#4E7BEE]"
                                                : showtimeStatus === "past"
                                                ? "border border-[#565F7E] text-[#565F7E] cursor-default"
                                                : "bg-[#1E29A8]";
                                            return (
                                              <Link
                                                key={show.show_id}
                                                href={
                                                  isPastShowtime
                                                    ? "#"
                                                    : `/booking/${show.show_id}`
                                                }
                                              >
                                                <Button
                                                  key={show.show_id}
                                                  disabled={isPastShowtime}
                                                  className={`${buttonColor} rounded-md md:px-6 px-4 py-3 md:w-32 w-24 h-12 text-xl font-bold hover:border ${
                                                    isPastShowtime
                                                      ? null
                                                      : "hover:bg-blue-400 hover:border-gray-500"
                                                  } `}
                                                >
                                                  {formatShowtime(
                                                    show.show_date_time
                                                  )}
                                                </Button>
                                              </Link>
                                            );
                                          })}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex justify-center items-center">
                        <p>No movie found.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ) : null;
          })
        ) : (
          <div className="flex justify-center items-center">
            <p>No cinema found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchResults;
