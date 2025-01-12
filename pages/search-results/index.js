import { useEffect, useState } from "react";
import Image from "next/image";
import {
  formatShowtime,
  classifyShowtime,
  getNextShowtime,
} from "@/utils/date";
import { groupByCinema, groupByMovie } from "@/utils/grouping";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import { SelectRoot, SelectTrigger } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useFilter } from "@/hooks/useFilter";
import FilterBar from "@/Components/search-result/filterbar";
import Footer from "@/Components/page-sections/footer";
import Pagination from "@/Components/search-result/pagination";
import { convertDate } from "@/utils/date";

function SearchResults() {
  const { results, loading, date, genre, page, totalPages, setPage } =
    useFilter();
  const [showMovieDetail, setShowMovieDetail] = useState({});

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

  const handleShowMovieDetail = (movieId, cinemaName) => {
    const key = `${movieId}_${cinemaName}`; // Create a unique key for each movie-cinema pair
    setShowMovieDetail((prev) => ({
      ...prev,
      [key]: !prev[key], // Toggle the specific movie-cinema detail
    }));
  };

  const cinemas = groupByCinema(results, date);
  const movies = groupByMovie(results, date);

  const filteredCinemas = Object.entries(cinemas)
    .map(([cinema_name, halls]) => {
      const filteredHalls = halls
        .map((hall) => {
          const filteredShowtimes = hall.showtimes.filter((show) => {
            const showDate = new Date(show.show_date_time).toDateString();
            const selectedDate = new Date(date).toDateString();
            return showDate === selectedDate;
          });

          return filteredShowtimes.length > 0
            ? { ...hall, showtimes: filteredShowtimes }
            : null;
        })
        .filter(Boolean);

      return filteredHalls.length > 0 ? [cinema_name, filteredHalls] : null;
    })
    .filter(Boolean);

  const filteredMovies = Object.entries(movies)
    .map(([movieName, movieDetails]) => {
      const filteredDetails = movieDetails.filter((detail) => {
        const showDate = detail.show_date_time
          ? new Date(detail.show_date_time).toDateString()
          : null;
        const selectedDate = new Date(date).toDateString();

        const isCinemaValid = filteredCinemas.some(([cinema_name, halls]) =>
          halls.some((hall) =>
            hall.showtimes.some(
              (showtime) =>
                showtime.title === detail.title &&
                new Date(showtime.show_date_time).toDateString() ===
                  selectedDate
            )
          )
        );

        return showDate === selectedDate && isCinemaValid;
      });

      return filteredDetails.length > 0 ? [movieName, filteredDetails] : null;
    })
    .filter(Boolean);

  const processRelatedMovies = (relatedMovies) => {
    return relatedMovies.map(([movieName, movieDetails]) => {
      const groupedByHall = movieDetails.reduce((acc, show) => {
        const hallName = show.hall_name.trim();
        const hallId = show.hall_id;

        if (!acc[hallId]) {
          acc[hallId] = {
            hall_name: hallName,
            shows: [],
          };
        }
        acc[hallId].shows.push(show);
        return acc;
      }, {});

      return {
        movieName,
        movieDetails: {
          ...movieDetails[0],
          halls: groupedByHall,
        },
      };
    });
  };

  return (
    <>
      <section className="w-full h-full flex flex-col items-center text-white my-7 gap-10">
        <FilterBar setPage={setPage} />
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
          ) : filteredCinemas.length > 0 &&
            new Date(date) >= new Date(new Date().toDateString()) ? (
            filteredCinemas.map(([cinema_name, halls]) => {
              const relatedMovies = filteredMovies.filter(
                ([movieName, movieDetails]) =>
                  movieDetails.some((detail) => {
                    const isCinemaMatch = detail.cinema_name === cinema_name;
                    const isDateMatch =
                      new Date(detail.show_date_time).toDateString() ===
                      new Date(date).toDateString();

                    return isCinemaMatch && isDateMatch;
                  })
              );

              const processedMovies = processRelatedMovies(relatedMovies);

              const cinemaId = results.filter(
                (result) => result.cinema_name === cinema_name
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
                          <Link href={`/cinemas/${cinemaId[0].cinema_id}`}>
                            <div className="flex items-center gap-5">
                              <Image
                                src="/icon.png"
                                width={44}
                                height={44}
                                alt="Icon"
                              />
                              <h1 className="text-2xl font-bold">
                                {cinema_name}
                              </h1>
                            </div>
                          </Link>
                          {results
                            .filter(
                              (result) =>
                                result.cinema_features &&
                                result.cinema_features.some(
                                  (feature) => feature !== null
                                ) &&
                                result.cinema_name === cinema_name
                            )
                            .map((result, index) => (
                              <div key={index} className="flex gap-5">
                                {result.cinema_features.map((feature, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-[#21263F] p-3 py-2 text-[14px] text-[#8B93B0] rounded-md"
                                  >
                                    {feature}
                                  </div>
                                ))}
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
                    <div className="bg-[#070C1B] border-t border-[#21263F] flex flex-col p-4">
                      {processedMovies.length > 0 ? (
                        processedMovies.map(({ movieName, movieDetails }) => {
                          const movie = movieDetails;
                          const hall = movieDetails.halls;

                          if (genre && !movie.genres.includes(genre)) {
                            return null;
                          }
                          return (
                            <>
                              <div
                                key={movieName}
                                className="flex flex-col md:flex-row w-full bg-[#070C1B] rounded-lg lg:min-h-[488px]"
                              >
                                <div className="w-full md:w-60 flex md:flex-col gap-6">
                                  <Link href={`/movies/${movie.movie_id}`}>
                                    <Image
                                      src={movie.poster}
                                      width={174}
                                      height={254}
                                      alt={movie.title}
                                      className="md:h-[254px] md:w-[192px] min-h-[150px] rounded"
                                    />
                                  </Link>
                                  <div className="w-full md:gap-2 flex flex-col gap-6">
                                    <Link href={`/movies/${movie.movie_id}`}>
                                      <h1 className="text-xl font-bold">
                                        {movieName}
                                      </h1>
                                    </Link>
                                    <div className="flex flex-wrap gap-2 md:w-[192px]">
                                      {movie.genres.map((genre, index) => (
                                        <Button
                                          key={index}
                                          className="bg-[#21263F] p-4 text-[#C8CEDD] cursor-default"
                                        >
                                          {genre.trim()}
                                        </Button>
                                      ))}
                                      <Button className="bg-[#21263F] p-4 text-[#C8CEDD] cursor-default">
                                        {movie.language}
                                      </Button>
                                    </div>
                                    <div
                                      onClick={() =>
                                        handleShowMovieDetail(
                                          movie.movie_id,
                                          cinema_name
                                        )
                                      }
                                      className="underline md:mt-5 cursor-pointer hover:font-bold"
                                    >
                                      Movie detail
                                    </div>
                                  </div>
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={
                                      showMovieDetail[
                                        `${movie.movie_id}_${cinema_name}`
                                      ]
                                        ? { height: "auto", opacity: 1 }
                                        : { height: 0, opacity: 0 }
                                    }
                                    transition={{
                                      duration: 0.5,
                                      ease: "easeInOut",
                                    }}
                                    style={{ overflow: "hidden" }}
                                  >
                                    <div className="md:max-w-[1200px] bg-[#070C1BB2] mb-4 md:flex-row flex-col backdrop-blur-md bg-opacity-70 rounded-lg hidden md:flex">
                                      <div className="flex">
                                        <div className="flex flex-col gap-5 w-[192px]">
                                          <div className="flex flex-col gap-3">
                                            <div className="xl:flex-row xl:gap-6 lg:gap-4 gap-3 xl:items-center flex flex-col">
                                              <p className="text-base text-[#C8CEDD]">
                                                Release date:{" "}
                                                {convertDate(
                                                  movie.release_date
                                                )}
                                              </p>
                                            </div>
                                            <div>
                                              <p className="hidden md:flex text-sm text-[#C8CEDD]">
                                                {movie.description}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="md:hidden text-base lg:mt-6 mt-1 text-[#C8CEDD]">
                                          {movie.description}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                                <div className="bg-[#070C1B] flex flex-col md:gap-14 gap-10 md:px-10 py-6">
                                  {Object.entries(hall)
                                    .filter(([hallId, hallData]) =>
                                      hallData.shows.some(
                                        (show) =>
                                          show.show_date_time &&
                                          show.cinema_name === cinema_name &&
                                          new Date(
                                            show.show_date_time
                                          ).toDateString() ===
                                            new Date(date).toDateString()
                                      )
                                    )
                                    .map(([hallId, hallData]) => {
                                      const { hall_name, shows } = hallData;
                                      return (
                                        <div
                                          key={hallId}
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
                                                const selectedDateStr =
                                                  new Date(date).toDateString();
                                                return (
                                                  showDate === selectedDateStr
                                                );
                                              })
                                              .map((show) => {
                                                const currentTime = new Date();
                                                const currentDate =
                                                  currentTime.toDateString();
                                                const selectedDateStr =
                                                  new Date(date).toDateString();
                                                const showtimeStatus =
                                                  classifyShowtime(
                                                    show.show_date_time
                                                  );
                                                const nextShow =
                                                  getNextShowtime(shows, date)
                                                    ?.show_id === show.show_id;
                                                const isPastShowtime =
                                                  new Date(
                                                    show.show_date_time
                                                  ) < new Date();
                                                const buttonColor =
                                                  selectedDateStr !==
                                                  currentDate
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
                                                      className={`${buttonColor} rounded-[4px] md:px-6 px-4 py-3 md:w-32 w-[103px] h-12 text-xl font-bold hover:border ${
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
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={
                                  showMovieDetail[
                                    `${movie.movie_id}_${cinema_name}`
                                  ]
                                    ? { height: "auto", opacity: 1 }
                                    : { height: 0, opacity: 0 }
                                }
                                transition={{
                                  duration: 0.5,
                                  ease: "easeInOut",
                                }}
                                style={{ overflow: "hidden" }}
                              >
                                <div className="md:max-w-[1200px] md:h-[100px] mb-4 bg-[#070C1BB2] md:flex-row flex flex-col backdrop-blur-md bg-opacity-70 rounded-lg md:hidden">
                                  <div className="flex">
                                    <div className="flex flex-col lg:gap-20 gap-5 w-full">
                                      <div className="flex flex-col gap-3">
                                        <div className="xl:flex-row xl:gap-6 lg:gap-4 gap-3 xl:items-center flex flex-col">
                                          <p className="md:text-xl text-base text-[#C8CEDD]">
                                            Release date:{" "}
                                            {convertDate(movie.release_date)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="hidden md:flex text-base text-[#C8CEDD]">
                                            {movie.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="md:hidden text-base lg:mt-6 mt-1 text-[#C8CEDD]">
                                      {movie.description}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            </>
                          );
                        })
                      ) : (
                        <div className="flex justify-center items-center px-4 md:px-0">
                          <p className="flex gap-5 justify-center items-center md:text-xl md:font-medium">
                            <div className="animate-bounce">
                              <Image
                                src="/img/popcorn.png"
                                width={40}
                                height={40}
                                alt="popcorn"
                              />
                            </div>
                            No movies available at this cinema on the selected
                            date.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ) : null;
            })
          ) : (
            <div className="flex justify-center items-center px-4 md:px-0">
              <p className="flex gap-5 justify-center items-center md:text-xl md:font-medium">
                <div className="animate-bounce">
                  <Image
                    src="/img/cinema.png"
                    width={40}
                    height={40}
                    alt="popcorn"
                  />
                </div>
                No cinemas showing this movie on the selected date.
              </p>
            </div>
          )}
        </div>
        <div>
          <Pagination
            totalPages={totalPages}
            siblingCount={1}
            page={page}
            setPage={setPage}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SearchResults;
