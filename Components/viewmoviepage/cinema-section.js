import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HStack, Input } from "@chakra-ui/react";
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
  formatShowtime,
  classifyShowtime,
  getNextShowtime,
} from "@/pages/utils/date";
import { groupBy } from "@/pages/utils/grouping";
import axios from "axios";

export function CinemaSection({
  movie,
  inputSearch,
  city,
  date,
  loading,
  setInputSearch,
  setCity,
  setCinema,
  setLoading,
}) {
  const [dropdownCities, setDropdownCities] = useState(
    createListCollection({
      items: [{ label: "All", value: "All" }],
    })
  );

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

  const handleCityChange = (city) => {
    setCity(city);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);

    if (city === "All") {
      setCinema("");
    }
  };

  const handleSearchChange = (e) => setInputSearch(e.target.value);
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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/movies/cities");
        console.log(`Response`, response);

        const fetchedItems = response.data.data.map((city) => ({
          label: city,
          value: city,
        }));

        const updatedItems = [{ label: "All", value: "All" }, ...fetchedItems];

        setDropdownCities(
          createListCollection({
            items: updatedItems,
          })
        );
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  return (
    <article className="md:max-w-[1200px] w-full md:my-10 my-5 flex flex-col">
      <form>
        <div className="md:flex-row flex flex-col w-full gap-5 py-12 px-4 lg:px-0 md:max-w-[1200px]">
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
            collection={dropdownCities}
            size="sm"
            className="bg-[#21263F] px-2 rounded-md flex justify-center border border-[#565F7E] md:w-[320px]"
          >
            <SelectTrigger className="w-full h-[46px] flex">
              <SelectValueText placeholder="City" className="text-[#8B93B0]" />
            </SelectTrigger>
            <SelectContent className="mt-2 bg-[#21263F] text-[#8B93B0] text-base border border-[#565F7E]">
              {dropdownCities.items.map((city) => (
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
                collection={dropdownCities}
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
                    <Image src="/icon.png" width={44} height={44} alt="Icon" />
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
                      const selectedDateStr = new Date(date).toDateString();
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
                            const currentDate = currentTime.toDateString();
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
  );
}
