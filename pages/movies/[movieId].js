"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchFilteredShows, viewMovie } from "../api/movies";
import { Button } from "@/components/ui/button";
import { HStack, Input, Kbd } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { LuSearch } from "react-icons/lu";
import Image from "next/image";
import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";

export default function ViewMovies() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [searchCinema, setSearchCinema] = useState([]);
  const [error, setError] = useState(null);
  const { movieId } = router.query;
  const currentDate = new Date();
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };
  const [date, setDate] = useState(new Date().toDateString());
  const groupByCinema = (movies) =>
    movies.reduce((acc, movie) => {
      if (!acc[movie.cinemaName]) {
        acc[movie.cinemaName] = [];
      }
      acc[movie.cinemaName].push(movie);
      return acc;
    }, {});

  const groupByHall = (movies) =>
    movies.reduce((acc, movie) => {
      const showDate = new Date(movie.showtime).toDateString();
      const selectedDate = new Date(date).toDateString();
      if (
        (!selectedCity || movie.cityName === selectedCity) &&
        showDate === selectedDate
      ) {
        if (!acc[movie.hallName]) {
          acc[movie.hallName] = [];
        }
        acc[movie.hallName].push(movie);
      }
      return acc;
    }, {});

  const days = Array.from({ length: 7 }, (_, index) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + index); // Add index days to the current date
    return {
      date: formatDate(nextDate),
      day:
        index === 0
          ? "Today"
          : nextDate.toLocaleDateString("en-US", { weekday: "short" }), // "Today" for the first day
    };
  });

  const dropdown = createListCollection({
    items: [
      { label: "Bangkok", value: "Bangkok" },
      { label: "Nonthaburi", value: "Nonthaburi" },
      { label: "Phatumthani", value: "Phatumthani" },
    ],
  });

  useEffect(() => {
    if (!movieId) return;

    const fetchData = async () => {
      try {
        console.log("Fetching movie data for movieId:", movieId);
        const movieData = await viewMovie(movieId);
        setMovies(movieData);
        console.log("Fetched movie data:", movieData);
        const cinemaData = await fetchFilteredShows({
          cinemaName: inputSearch,
          date: date,
        });
        console.log("Fetched cinema data:", cinemaData);
        if (cinemaData) {
          setSearchCinema(cinemaData);
        } else {
          console.log("No cinema data found for the selected date and search.");
        }
      } catch (err) {
        console.error("Failed to fetch movie data:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [movieId, inputSearch, date]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!movies || movies.length === 0) {
    return <p>Loading...</p>;
  }
  const cinemas = groupByCinema(movies);
  const filteredHalls = groupByHall(movies);

  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);

    return formattedDate;
  };

  const formatShowtime = (showtime) => {
    const date = new Date(showtime);
    return date
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(":", ".");
  };

  const classifyShowtime = (showtime) => {
    const currentTime = new Date();
    const showTime = new Date(showtime);
    const currentDate = currentTime.toDateString(); // Current day's date (without time)
    const showDate = showTime.toDateString(); // Show's date (without time)

    if (showDate > currentDate) {
      return "upcoming";
    }
    // If the showtime is on the current day
    if (showDate === currentDate) {
      if (showTime < currentTime) {
        return "past";
      }
      const diffMinutes = (showTime - currentTime) / (1000 * 60);
      if (diffMinutes > 0 && diffMinutes <= 30) {
        return "nearly";
      }
      return "upcoming";
    }
    // If the showtime is on a previous day
    return "past";
  };

  const getNextShowtime = (shows, selectedDate) => {
    const currentTime = new Date();
    const selectedDateStr = new Date(selectedDate).toDateString(); // Compare only the selected date
    const filteredShows = shows
      .filter(
        (show) => new Date(show.showtime).toDateString() === selectedDateStr
      )
      .sort((a, b) => new Date(a.showtime) - new Date(b.showtime)); // Sort shows by ascending time
    return filteredShows.find((show) => new Date(show.showtime) > currentTime);
  };

  const handleCity = (city) => {
    setSelectedCity(city);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setInputSearch(event.target.value);
  };

  const handleDate = async (day) => {
    setDate(day.date);
  };

  const filteredCinemas = Object.entries(cinemas).filter(
    ([cinemaName, shows]) => {
      const matchesCity =
        !selectedCity || shows.some((show) => show.cityName === selectedCity);
      const matchesSearch =
        !inputSearch ||
        cinemaName.toLowerCase().includes(inputSearch.toLowerCase());
      const matchesDate = shows.some((show) => {
        const showDate = new Date(show.showtime).toDateString();
        const selectedDate = new Date(date).toDateString();
        return showDate === selectedDate;
      });
      return matchesCity && matchesSearch && matchesDate;
    }
  );

  return (
    <section className="w-full h-full flex flex-col items-center text-white">
      <div className="relative w-full h-[440px]">
        <Image
          src={movies[0].movieBanner}
          alt="Dark Knight"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <div className="absolute top-36 w-[1200px] h-[600px] bg-[#070C1BB2] flex backdrop-blur-md bg-opacity-70 rounded-lg">
        <Image
          src={movies[0].moviePoster}
          width={411}
          height={600}
          alt="Dark Kninght"
        />
        <div className="p-16 flex flex-col gap-20">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl">{movies[0].movieTitle}</h1>
            <div className="flex gap-5 items-center">
              <Button className="bg-[#21263F] p-4">Action</Button>
              <Button className="bg-[#21263F] p-4">Crime</Button>
              <Button className="bg-[#21263F] p-4">
                {movies[0].movieLang}
              </Button>
              <div className="border-l-2 border-gray-500 h-full"></div>
              <p className="text-xl">
                Release date: {convertDate(movies[0].movieReleaseDate)}
              </p>
            </div>
            <Button className="bg-[#4E7BEE] w-1/3 h-12 mt-6">
              Movie detail
            </Button>
            <div>
              <p className="text-lg mt-6">{movies[0].movieDescription}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-96 w-full h-28 bg-[#070C1B] gap-6 flex justify-center items-center">
        <div className="flex gap-1 w-[1200px] justify-between">
          {days.map((day) => (
            <div
              key={day.date}
              onClick={() => handleDate(day)}
              className={`p-2 w-44 text-center flex flex-col rounded-md cursor-pointer ${
                day.date === date
                  ? "bg-[#21263F] font-bold"
                  : "bg-none text-gray-300"
              }`}
            >
              <div className="text-2xl">{day.day}</div>
              <div
                className={`${
                  day.date === date ? "text-[#C8CEDD]" : "text-[#565F7E]"
                }`}
              >
                {day.date}
              </div>
            </div>
          ))}
        </div>
      </div>
      <article className="w-[1200px] mt-10 flex flex-col gap-10">
        <div className="flex w-full gap-5">
          <HStack
            gap="10"
            width="full"
            className="bg-[#21263F] px-2 rounded-md h-12 border border-[#565F7E]"
          >
            <InputGroup flex="1" endElement={<LuSearch />} className="">
              <Input
                placeholder="Search cinema"
                onChange={handleSearch}
                value={inputSearch}
              />
            </InputGroup>
          </HStack>
          <SelectRoot
            collection={dropdown}
            size="sm"
            width="320px"
            className="bg-[#21263F] px-2 rounded-md flex justify-center border border-[#565F7E]"
          >
            <SelectTrigger className="w-full">
              <SelectValueText placeholder="City" className="text-[#8B93B0]" />
            </SelectTrigger>
            <SelectContent className="mt-2 bg-[#21263F] text-[#8B93B0] text-base border border-[#565F7E]">
              {dropdown.items.map((city) => (
                <SelectItem
                  item={city}
                  key={city.value}
                  onClick={() => handleCity(city.value)}
                  className="hover:bg-slate-300 hover:text-slate-800"
                >
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </div>
        {filteredCinemas.map(([cinemaName, shows]) => (
          <div key={cinemaName} className="">
            <SelectRoot
              collection={dropdown}
              size="sm"
              width="1200px"
              className="bg-[#070C1B] p-4 rounded-md"
            >
              <SelectTrigger>
                <div className="flex items-center gap-5">
                  <Image src="/icon.png" width={44} height={44} alt="Icon" />
                  <h1 className="text-2xl">{cinemaName}</h1>
                  <Button className="bg-[#21263F] p-3 text-[14px] text-[#8B93B0] rounded-md">
                    Hearing assistance
                  </Button>
                  <Button className="bg-[#21263F] p-3 text-[14px] text-[#8B93B0] rounded-md">
                    Wheelchair access
                  </Button>
                </div>
              </SelectTrigger>
              <SelectContent className="mt-2 rounded-md bg-[#070C1B] border border-[#565F7E]">
                <div className="flex text-white">
                  <Image src="/icon.png" width={44} height={44} alt="Icon" />
                  <SelectItem
                    item={cinemaName}
                    key={cinemaName}
                    className="text-xl pl-4 hover:cursor-pointer"
                  >
                    <div className="flex h-6 gap-5 items-center">
                      {cinemaName}{" "}
                      <div className="border-l-2 border-gray-500 h-full"></div>{" "}
                      <p className="text-lg text-gray-400">
                        {shows[0]?.cinemaAddress}
                      </p>
                    </div>
                  </SelectItem>
                </div>
              </SelectContent>
            </SelectRoot>
            <div className="bg-[#070C1B] border-t border-[#21263F] flex flex-col gap-14 p-10">
              {Object.entries(filteredHalls)
                .filter(([hallName, hallShows]) =>
                  hallShows.some((show) => {
                    const showDate = new Date(show.showtime).toDateString();
                    const selectedDateStr = new Date(date).toDateString();
                    return (
                      showDate === selectedDateStr &&
                      show.cinemaName === cinemaName
                    );
                  })
                )
                .map(([hallName, shows]) => (
                  <div key={hallName} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-[#C8CEDD]">
                      {hallName}
                    </h2>
                    <div className="flex flex-wrap gap-4 mt-4">
                      {shows
                        .filter((show) => {
                          const showDate = new Date(
                            show.showtime
                          ).toDateString();
                          const selectedDateStr = new Date(date).toDateString();
                          return showDate === selectedDateStr;
                        })
                        .map((show) => {
                          const currentTime = new Date();
                          const currentDate = currentTime.toDateString();
                          const selectedDateStr = new Date(date).toDateString();
                          const showtimeStatus = classifyShowtime(
                            show.showtime
                          );
                          const nextShow =
                            getNextShowtime(shows, date)?.showId ===
                            show.showId;
                          const buttonColor =
                            selectedDateStr !== currentDate
                              ? "bg-[#1E29A8]"
                              : nextShow
                              ? "bg-[#4E7BEE]"
                              : showtimeStatus === "past"
                              ? "border border-[#565F7E] text-[#565F7E] cursor-default"
                              : "bg-[#1E29A8]";
                          return (
                            <Button
                              key={show.showId}
                              className={`${buttonColor} rounded-md px-6 py-3 w-32 h-12 text-xl font-bold`}
                            >
                              {formatShowtime(show.showtime)}
                            </Button>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
        <div></div>
      </article>
    </section>
  );
}
