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

export default function MovieSection({ movie, date, loading, setLoading }) {
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
  console.log(`groupedMovies`, groupedMovies);

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
                    className="w-24 h-36 md:h-[254px] md:w-full rounded-md"
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
                  <a href="#" className="underline md:mt-5">
                    Movie detail
                  </a>
                </div>
              </div>
              <div className="bg-[#070C1B] flex flex-col md:gap-14 gap-4 md:p-10 p-4 py-6">
                {Object.entries(halls).map(([hallName, shows]) => (
                  <div key={hallName} className="flex flex-col md:gap-4 gap-2">
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
                          <Button
                            key={show.show_id}
                            className={`${buttonColor} rounded-md md:px-6 px-4 py-3 md:w-32 w-24 h-12 text-xl font-bold`}
                          >
                            {formatShowtime(show.show_date_time)}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
