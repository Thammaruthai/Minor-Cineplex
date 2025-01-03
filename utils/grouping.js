export const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});

export function groupByCinema(results, date) {
  return results.reduce((acc, cinema) => {
    const showDateStr = new Date(date).toDateString();

    const filteredHalls = cinema.halls
      .map((hall) => {
        const validShowtimes = hall.showtimes.filter(
          (show) => new Date(show.show_date_time).toDateString() === showDateStr
        );

        return validShowtimes.length > 0
          ? { ...hall, showtimes: validShowtimes }
          : null;
      })
      .filter(Boolean);

    if (filteredHalls.length > 0) {
      acc[cinema.cinema_name] = filteredHalls;
    }

    return acc;
  }, {});
}

export const groupByHall = (results, date) => {
  if (!date) {
    // Fallback to today's date if no date is provided
    date = new Date().toDateString();
  }

  const selectedDate = new Date(date).toDateString();
  return results.reduce((acc, show) => {
    const showDate = new Date(show.show_date_time).toDateString();
    if (showDate === selectedDate) {
      acc[show.hall_name] = acc[show.hall_name] || [];
      acc[show.hall_name].push(show);
    }
    return acc;
  }, {});
};

export function groupByMovie(results, date) {
  const showDateStr = new Date(date).toDateString();
  return results.flatMap((cinema) =>
    cinema.halls.flatMap((hall) =>
      hall.showtimes.filter(
        (show) =>
          new Date(show.show_date_time).toDateString() === showDateStr
      )
    )
  ).reduce((acc, show) => {
    if (!acc[show.title]) acc[show.title] = [];
    acc[show.title].push(show);
    return acc;
  }, {});
}

