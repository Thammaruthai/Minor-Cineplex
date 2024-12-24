export const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});

export const groupByCinema = (results, date) => {
  if (!date) {
    // Fallback to today's date if no date is provided
    date = new Date().toISOString();
  }

  const selectedDate = new Date(date).toDateString();
  return results.reduce((acc, show) => {
    const showDate = new Date(show.show_date_time).toDateString();
    if (showDate === selectedDate) {
      acc[show.cinema_name] = acc[show.cinema_name] || [];
      acc[show.cinema_name].push(show);
    }
    return acc;
  }, {});
};

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

export const groupByMovie = (movies, date) => {
  if (!date) {
    // Fallback to today's date if no date is provided
    date = new Date().toDateString();
  }
  const selectedDate = new Date(date).toDateString();
  return movies.reduce((acc, movie) => {
    const showDate = new Date(movie.show_date_time).toDateString();
    if (showDate === selectedDate) {
      const movieTitle = movie.movies.title;

      if (!acc[movieTitle]) {
        acc[movieTitle] = [];
      }
      acc[movieTitle].push(movie);
    }

    return acc;
  }, {});
};
