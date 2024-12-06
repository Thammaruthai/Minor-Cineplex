import { useState } from "react";
import { formatDate } from "@/utils/date";

export function DateSection({ setDate, date, setLoading }) {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(date);
  const currentDate = new Date().toDateString();
  const totalDays = 12;
  const limitDays = 6;

  const days = Array.from({ length: totalDays }, (_, index) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + index);
    return {
      date: formatDate(nextDate),
      day:
        index === 0
          ? "Today"
          : nextDate.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });

  const handleDateChange = (day) => {
    setLoading(true);
    setSelectedDate(day.date);
    setDate(day.date);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleNext = () => {
    if (startIndex + limitDays < days.length) {
      setStartIndex(startIndex + limitDays);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - limitDays);
    }
  };

  console.log(`Current Date`, currentDate);
  console.log(`Selected Date`, selectedDate);

  const visibleDays = days.slice(startIndex, startIndex + limitDays);

  return (
    <div className="md:w-full w-full p-4 h-28 bg-[#070C1B] md:gap-1 flex justify-center items-center">
      {startIndex === 0 ? null : (
        <button
          className="text-gray-300 p-2 hover:text-white"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="gray"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-chevron-left"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
      <div className="flex gap-1 overflow-x-auto xl:overflow-x-hidden md:w-full md:max-w-[1200px] justify-between">
        {visibleDays.map((day) => (
          <div
            key={day.date}
            onClick={() => handleDateChange(day)}
            className={`p-2 w-28 md:w-40 flex-shrink-0 text-center flex flex-col rounded-md cursor-pointer ${
              day.date === selectedDate ||
              (day.day === "Today" && selectedDate === currentDate)
                ? "bg-[#21263F] font-bold"
                : "bg-none text-gray-300"
            }`}
          >
            <div className="md:text-2xl text-lg">{day.day}</div>
            <div
              className={`${
                day.date === selectedDate ||
                (day.day === "Today" && selectedDate === currentDate)
                  ? "text-[#C8CEDD]"
                  : "text-[#565F7E]"
              }`}
            >
              {day.date}
            </div>
          </div>
        ))}
        {startIndex + limitDays >= days.length ? null : (
          <button
            className="text-gray-300 p-2 hover:text-white"
            onClick={handleNext}
            disabled={startIndex + limitDays >= days.length}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="gray"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
