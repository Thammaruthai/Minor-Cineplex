"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { HStack, Input, Stack } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { LuSearch } from "react-icons/lu";
import Image from "next/image";
import { createListCollection } from "@chakra-ui/react";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import {
  formatDate,
  convertDate,
  formatShowtime,
  classifyShowtime,
  getNextShowtime,
} from "../utils/date";
import { groupBy } from "../utils/grouping";
import CustomSkeleton from "../utils/skeleton";

export default function viewMovie() {
  const router = useRouter();
  const { movieId } = router.query;
  const [movie, setMovie] = useState([]);
  const [city, setCity] = useState("All");
  const [cinema, setCinema] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const currentDate = new Date();
  const [date, setDate] = useState(new Date().toDateString());
  const dropdown = createListCollection({
    items: [
      { label: "All", value: "All" },
      { label: "Bangkok", value: "Bangkok" },
      { label: "Nonthaburi", value: "Nonthaburi" },
      { label: "Phatumthani", value: "Phatumthani" },
      { label: "Chiangmai", value: "Chiangmai" },
    ],
  });

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

  useEffect(() => {
    const storedDate = localStorage.getItem("selectedDate");
    if (storedDate) {
      setDate(storedDate); // Set the stored date
    } else {
      const today = new Date().toDateString();
      setDate(today); // Set today's date if no date is stored
      localStorage.setItem("selectedDate", today); // Store today's date in localStorage
    }
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const params = new URLSearchParams({ movieId, city, cinema });
        const response = await axios.get(
          city === "All"
            ? `/api/movies/${movieId}`
            : `/api/movies/${movieId}?city=${city}&cinema=${cinema}`
        );
        setMovie(response.data.movies);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };
    if (movieId) {
      fetchData();
    }
  }, [movieId, date, city]);

  const handleCityChange = (city) => {
    setCity(city);
    if (city === "All") {
      setCinema("");
    }
  };

  const handleSearchChange = (e) => setInputSearch(e.target.value);
  const handleDateChange = (day) => {
    setLoading(true);
    const newDate = day.date;
    setDate(newDate);
    localStorage.setItem("selectedDate", newDate);
  };

  const groupByHall = (movies) =>
    movies.reduce((acc, movie) => {
      const showDate = new Date(movie.show_date_time).toDateString();
      const selectedDate = new Date(date).toDateString();
      if (
        (city === "All" || movie.city_name === city) &&
        showDate === selectedDate
      ) {
        if (!acc[movie.hall_name]) {
          acc[movie.hall_name] = [];
        }
        acc[movie.hall_name].push(movie);
      }
      return acc;
    }, {});

  const cinemas = groupBy(movie, "cinema_name");
  const filteredHalls = groupByHall(movie);

  const filteredCinemas = Object.entries(cinemas).filter(
    ([cinema_name, shows]) => {
      const matchesCity =
        city === "All" || shows.some((show) => show.city_name === city);
      const matchesSearch =
        !inputSearch ||
        cinema_name.toLowerCase().includes(inputSearch.toLowerCase());
      const matchesDate = shows.some((show) => {
        const showDate = new Date(show.show_date_time).toDateString();
        const selectedDate = new Date(date).toDateString();
        return showDate === selectedDate;
      });
      return matchesCity && matchesSearch && matchesDate;
    }
  );

  return (
    <section className="w-full h-full flex flex-col items-center text-white">
      {movie && movie.length > 0 ? (
        <>
          <div className="hidden md:flex md:relative w-full h-[440px]">
            <Image
              src={movie[0].banner}
              alt={movie[0].title || "Movie Banner"}
              layout="fill"
              objectFit="cover"
              className="w-full h-full opacity-60"
            />
          </div>
          <div className="md:absolute md:top-36 md:max-w-[1200px] lg:min-w-[1200px] h-[600px] bg-[#070C1BB2] md:flex-row flex flex-col backdrop-blur-md bg-opacity-70 rounded-lg">
            <Image
              src={movie[0].poster}
              width={411}
              height={600}
              alt={movie[0].title || "Movie Poster"}
            />
            <div className="md:p-16 flex flex-col md:gap-20 gap-10 py-10 px-4">
              <div className="flex flex-col gap-6">
                <h1 className="md:text-5xl text-3xl font-bold">
                  {movie[0].title}
                </h1>
                <div className="md:flex-row gap-6 md:items-center flex flex-col">
                  <div className="flex md:gap-5 gap-2 items-center">
                    {movie[0].genre.split(",").map((genre, index) => (
                      <Button
                        key={index}
                        className="bg-[#21263F] p-4 text-[#C8CEDD]"
                      >
                        {genre.trim()}
                      </Button>
                    ))}
                    <Button className="bg-[#21263F] p-4">
                      {movie[0].language}
                    </Button>
                    <span className="border-l-2 border-gray-500 md:h-full h-3/4"></span>
                  </div>
                  <p className="md:text-xl text-[#C8CEDD]">
                    Release date: {convertDate(movie[0].release_date)}
                  </p>
                </div>
                <Button className="bg-[#4E7BEE] w-40 h-12 md:mt-6">
                  Movie detail
                </Button>
                <div>
                  <p className="text-lg mt-6 text-[#C8CEDD]">
                    {movie[0].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:mt-96 mt-[24rem] md:w-full w-full p-4 h-28 bg-[#070C1B] md:gap-6 flex justify-center items-center">
            <div className="flex gap-1 overflow-x-auto md:overflow-x-hidden md:w-full md:max-w-[1200px] justify-between">
              {days.map((day) => (
                <div
                  key={day.date}
                  onClick={() => handleDateChange(day)}
                  className={`p-2 w-28 md:w-40 flex-shrink-0 text-center flex flex-col rounded-md cursor-pointer ${
                    day.date === date ||
                    (new Date(day.date).toDateString() ===
                      new Date().toDateString() &&
                      !date)
                      ? "bg-[#21263F] font-bold"
                      : "bg-none text-gray-300"
                  }`}
                >
                  <div className="md:text-2xl text-lg">{day.day}</div>
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
          <article className="md:max-w-[1200px] w-full md:mt-10 flex flex-col">
            <form>
              <div className="md:flex-row flex flex-col w-full gap-5 py-10 px-4 md:px-0 md:max-w-[1200px]">
                <HStack
                  gap="10"
                  width="full"
                  className="bg-[#21263F] px-2 rounded-md h-12 border border-[#565F7E]"
                >
                  <InputGroup
                    flex="1"
                    endElement={<LuSearch />}
                    className="h-12 flex"
                  >
                    <Input
                      placeholder="Search cinema"
                      onChange={handleSearchChange}
                      value={inputSearch}
                    />
                  </InputGroup>
                </HStack>
                <SelectRoot
                  collection={dropdown}
                  size="sm"
                  className="bg-[#21263F] px-2 rounded-md flex justify-center border border-[#565F7E] md:w-[320px]"
                >
                  <SelectTrigger className="w-full h-[46px] flex">
                    <SelectValueText
                      placeholder="City"
                      className="text-[#8B93B0]"
                    />
                  </SelectTrigger>
                  <SelectContent className="mt-2 bg-[#21263F] text-[#8B93B0] text-base border border-[#565F7E]">
                    {dropdown.items.map((city) => (
                      <SelectItem
                        item={city}
                        key={city.value}
                        onClick={() => handleCityChange(city.value)}
                        className="hover:bg-slate-300 hover:text-slate-800"
                      >
                        {city.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </div>
            </form>
            <div className="flex flex-col gap-6 w-full">
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
                filteredCinemas.map(([cinema_name, shows]) => (
                  <div
                    key={cinema_name}
                    className="selectCinema flex flex-col w-full"
                  >
                    <SelectRoot
                      collection={dropdown}
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
                              <h1 className="text-2xl">{cinema_name}</h1>
                            </div>
                            <div className="flex gap-5">
                              <Button className="bg-[#21263F] p-3 text-[14px] text-[#8B93B0] rounded-md">
                                Hearing assistance
                              </Button>
                              <Button className="bg-[#21263F] p-3 text-[14px] text-[#8B93B0] rounded-md">
                                Wheelchair access
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center">
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
                        </div>
                      </SelectTrigger>
                      <SelectContent className="mt-2 rounded-md bg-[#070C1B] border border-[#565F7E]">
                        <div className="flex text-white">
                          <Image
                            src="/icon.png"
                            width={44}
                            height={44}
                            alt="Icon"
                          />
                          <SelectItem
                            item={cinema_name}
                            key={cinema_name}
                            className="text-xl pl-4 hover:cursor-pointer"
                          >
                            <div className="flex h-6 gap-5 items-center">
                              {cinema_name}{" "}
                              <div className="border-l-2 border-gray-500 h-full"></div>{" "}
                              <p className="text-lg text-gray-400">
                                {shows[0]?.address}
                              </p>
                            </div>
                          </SelectItem>
                        </div>
                      </SelectContent>
                    </SelectRoot>
                    <div className="bg-[#070C1B] border-t border-[#21263F] flex flex-col md:gap-14 gap-4 md:p-10 p-4">
                      {Object.entries(filteredHalls)
                        .filter(([hall_name, hallShows]) =>
                          hallShows.some((show) => {
                            const showDate = new Date(
                              show.show_date_time
                            ).toDateString();
                            const selectedDateStr = new Date(
                              date
                            ).toDateString();
                            return (
                              showDate === selectedDateStr &&
                              show.cinema_name === cinema_name
                            );
                          })
                        )
                        .map(([hall_name, shows]) => (
                          <div key={hall_name} className="flex flex-col gap-4">
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
                                  const showtimeStatus = classifyShowtime(
                                    show.show_date_time
                                  );
                                  const nextShow =
                                    getNextShowtime(shows, date)?.show_id ===
                                    show.show_id;
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
                ))
              ) : (
                <div className="flex justify-center items-center">
                  <p>No cinema found.</p>
                </div>
              )}
            </div>
          </article>
        </>
      ) : (
        <div>
          <p>No movies found.</p>
        </div>
      )}
    </section>
  );
}
