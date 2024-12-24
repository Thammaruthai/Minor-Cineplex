// Formats a date into 'DD MMM YYYY' format
export const formatDate = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  
// Formats a date into 'DD MMM YYYY' format
export const convertDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  return formattedDate;
};

// Formats a showtime into 'HH.MM' format
export const formatShowtime = (showtime) =>
  new Date(showtime)
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", ".");

// Classifies showtime as 'past', 'upcoming', or 'nearly'
export const classifyShowtime = (showtime) => {
  const currentTime = new Date();
  const showTime = new Date(showtime);
  const currentDate = currentTime.toDateString();
  const showDate = showTime.toDateString();

  if (showDate > currentDate) return "upcoming";
  if (showDate === currentDate) {
    if (showTime < currentTime) return "past";
    return (showTime - currentTime) / (1000 * 60) <= 30 ? "nearly" : "upcoming";
  }
  return "past";
};

// Gets the next showtime for a specific date
export const getNextShowtime = (shows, selectedDate) => {
  const currentTime = new Date();
  const selectedDateStr = new Date(selectedDate).toDateString();
  return shows
    .filter(
      (show) => new Date(show.show_date_time).toDateString() === selectedDateStr
    )
    .sort((a, b) => new Date(a.show_date_time) - new Date(b.show_date_time))
    .find((show) => new Date(show.show_date_time) > currentTime);
};

export const formatedDate =  (dateString) => {
  if (!dateString) return ""; // Handle cases where the date is undefined
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const formatDateToLocal = (date) => {
  if (!date) return new Date().toDateString();

  const options = { day: "2-digit", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
};
