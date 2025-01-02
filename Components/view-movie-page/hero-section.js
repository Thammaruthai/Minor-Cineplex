import { useMovie } from "@/hooks/useMovies";
import { convertDate } from "@/utils/date";
import { Button } from "@chakra-ui/react";
import Image from "next/image";

export function HeroSection() {
  const { movie } = useMovie();
  if (movie.length === 0) {
    return;
  }
  const currentMovie = movie[0];
  return (
    <>
      <div className="hidden md:flex md:relative w-full h-[440px] md:mb-96">
        <Image
          src={currentMovie.movies.banner}
          alt={currentMovie.movies.title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="w-full h-full opacity-60"
        />
      </div>
      <div className="md:absolute md:top-36 md:max-w-[1200px] md:h-[600px] h-[500px] bg-[#070C1BB2] md:flex-row flex flex-col backdrop-blur-md bg-opacity-70 rounded-lg mb-[32rem]">
        <Image
          src={currentMovie.movies.poster}
          width={411}
          height={600}
          alt={currentMovie.movies.title}
          className="w-full max-h-[600px] md:w-[411px]"
        />
        <div className="lg:p-16 flex flex-col md:gap-20 gap-10 py-10 px-4 w-full">
          <div className="flex flex-col gap-6">
            <h1 className="md:text-5xl text-3xl font-bold">
              {currentMovie.movies.title}
            </h1>
            <div className="xl:flex-row gap-6 xl:items-center flex flex-col">
              <div className="flex md:gap-3 gap-2 items-center">
                {currentMovie.movies.genres.map((genre, index) => (
                  <Button
                    key={index}
                    className="bg-[#21263F] p-4 text-[#C8CEDD]"
                  >
                    {genre.trim()}
                  </Button>
                ))}
                <Button className="bg-[#21263F] p-4">
                  {currentMovie.movies.language}
                </Button>
                <div className="xl:hidden border-l-2 border-gray-500 md:h-full h-3/4 "></div>
              </div>
              <div className="hidden md:flex border-l-2 border-gray-500 md:h-3/4 "></div>
              <p className="md:text-xl text-[#C8CEDD]">
                Release date: {convertDate(currentMovie.movies.release_date)}
              </p>
            </div>
            <Button className="bg-[#4E7BEE] w-40 h-12 md:mt-6 cursor-default">
              Movie detail
            </Button>
            <div>
              <p className="text-lg mt-6 text-[#C8CEDD]">
                {currentMovie.movies.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
