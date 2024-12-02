export const groupBy = (items, key) =>
  items.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});

export const groupByHall = (movies) =>
    movies.reduce((acc, movie) => {
      const showDate = new Date(movie.show_date_time).toDateString();
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