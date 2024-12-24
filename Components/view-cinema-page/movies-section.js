import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  formatShowtime,
  classifyShowtime,
  getNextShowtime,
} from "@/utils/date";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { convertDate } from "@/utils/date";

export default function MovieSection({ movie, date, loading, setLoading }) {
  const [showMovieDetail, setShowMovieDetail] = useState({});

  const groupByHall = (movies) =>
    movies.reduce((acc, movie) => {
      const showDate = new Date(movie.show_date_time).toDateString();
      const selectedDate = new Date(date).toDateString();
      if (showDate === selectedDate) {
        if (!acc[movie.hall_name]) {
          acc[movie.hall_name] = [];
        }
        acc[movie.hall_name].push(movie);
      }
      return acc;
    }, {});

  const groupByMovie = (movies) =>
    movies.reduce((acc, movie) => {
      const showDate = new Date(movie.show_date_time).toDateString();
      const selectedDate = new Date(date).toDateString();
      if (showDate === selectedDate) {
        if (!acc[movie.movie_name]) {
          acc[movie.movie_name] = [];
        }
        acc[movie.movie_name].push(movie);
      }
      return acc;
    }, {});

  const groupedMovies = groupByMovie(movie);

  const handleShowMovieDetail = (movieName) => {
    setShowMovieDetail((prev) => ({
      ...prev,
      [movieName]: !prev[movieName],
    }));
  };

  return (
    <article className="md:max-w-[1200px] w-full md:my-10 my-5 flex flex-col gap-6">
      {loading ? (
        <div className="flex justify-center items-center gap-3">
          <div>
            <ProgressCircleRoot value={null} size="sm">
              <ProgressCircleRing cap="round" />
            </ProgressCircleRoot>
          </div>
          <p>Loading...</p>
        </div>
      ) : Object.entries(groupedMovies).length > 0 ? (
        Object.entries(groupedMovies).map(([movieName, movieDetails]) => {
          const halls = groupByHall(movieDetails);

          return (
            <>
              <div
                key={movieDetails[0]?.movies.movieId}
                className="flex flex-col md:flex-row w-full bg-[#070C1B] rounded-lg  md:border-t border-[#21263F]"
              >
                <div className="p-6 w-full md:w-60 flex md:flex-col gap-6">
                  <Link href={`/movies/${movieDetails[0]?.movies.movieId}`}>
                    <Image
                      src={movieDetails[0]?.movies.poster}
                      width={174}
                      height={254}
                      alt={movieDetails[0]?.movies.title}
                      className="md:h-[254px] md:w-full rounded-md"
                    />
                  </Link>
                  <div className="w-full md:gap-2 flex flex-col gap-6">
                    <Link href={`/movies/${movieDetails[0]?.movies.movieId}`}>
                      <h1 className="text-xl font-bold">{movieName}</h1>
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails[0]?.movies.genres.map((genre, index) => (
                        <Button
                          key={index}
                          className="bg-[#21263F] p-4 text-[#C8CEDD]"
                        >
                          {genre.trim()}
                        </Button>
                      ))}
                      <Button className="bg-[#21263F] p-4 text-[#C8CEDD]">
                        {movieDetails[0]?.movies.language}
                      </Button>
                    </div>
                    <div
                      onClick={() => handleShowMovieDetail(movieName)}
                      className="underline md:mt-5 cursor-pointer hover:font-bold"
                    >
                      Movie detail
                    </div>
                  </div>
                </div>
                <div className="bg-[#070C1B] flex flex-col md:gap-14 gap-4 md:p-10 p-4 py-6">
                  {Object.entries(halls).map(([hallName, shows]) => (
                    <div
                      key={hallName}
                      className="flex flex-col md:gap-4 gap-2"
                    >
                      <h2 className="text-2xl font-bold text-[#C8CEDD]">
                        {hallName}
                      </h2>
                      <div className="flex flex-wrap gap-4 mt-4">
                        {shows.map((show) => {
                          const showtimeStatus = classifyShowtime(
                            show.show_date_time
                          );
                          const nextShow =
                            getNextShowtime(shows, date)?.show_id ===
                            show.show_id;
                          const isPastShowtime =
                            new Date(show.show_date_time) < new Date();
                          const buttonColor =
                            new Date(date).toDateString() !==
                            new Date().toDateString()
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
                                disabled={isPastShowtime}
                                key={show.show_id}
                                className={`${buttonColor} rounded-md md:px-6 px-4 py-3 md:w-32 w-24 h-12 text-xl font-bold`}
                              >
                                {formatShowtime(show.show_date_time)}
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={
                  showMovieDetail[movieName]
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="md:max-w-[1200px] md:h-[300px] p-6 md:p-0 bg-[#070C1BB2] md:flex-row flex flex-col backdrop-blur-md bg-opacity-70 rounded-lg md:border-b border-[#21263F]">
                  <div className="flex">
                    <Image
                      src={movieDetails[0]?.movies.poster}
                      width={174}
                      height={155}
                      alt={movieDetails[0]?.movies.title}
                      className="h-[155px] md:min-h-[300px] md:w-[300px]"
                    />
                    <div className="lg:p-5 xl:p-10 lg:px-16 flex flex-col lg:gap-20 gap-5 md:py-5 md:px-16 px-6 w-full">
                      <div className="flex flex-col gap-6">
                        <h1 className="md:text-3xl text-xl font-bold">
                          {movieDetails[0]?.movies.title}
                        </h1>
                        <div className="xl:flex-row xl:gap-6 lg:gap-4 gap-3 xl:items-center flex flex-col">
                          <div className="flex flex-wrap md:gap-3 gap-2 items-center">
                            {movieDetails[0]?.movies.genres.map(
                              (genre, index) => (
                                <Button
                                  key={index}
                                  className="bg-[#21263F] p-4 text-[#C8CEDD]"
                                >
                                  {genre.trim()}
                                </Button>
                              )
                            )}
                            <Button className="bg-[#21263F] p-4">
                              {movieDetails[0]?.movies.language}
                            </Button>
                          </div>
                          <div className="hidden md:flex border-l-2 border-gray-500 md:h-3/4 "></div>
                          <p className="md:text-xl text-sm text-[#C8CEDD]">
                            Release date:{" "}
                            {convertDate(movieDetails[0]?.movies.release_date)}
                          </p>
                        </div>
                        <div>
                          <p className="hidden md:flex text-base xl:mt-6 text-[#C8CEDD]">
                            {movieDetails[0]?.movies.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="md:hidden text-base lg:mt-6 mt-1 text-[#C8CEDD]">
                      {movieDetails[0]?.movies.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          );
        })
      ) : (
        <div className="flex justify-center items-center">
          <p>No movie found.</p>
        </div>
      )}
    </article>
  );
}
