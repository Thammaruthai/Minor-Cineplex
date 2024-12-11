///รอแก้ sprint 2

export default function ResultFromFilter({ filteredMovies }) {
  return (
    <section className="mx-5 lg:mx-20">
      <h2 className="text-white text-2xl font-bold my-4">Search Results</h2>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.movie_id} className="flex flex-col">
              <div>
                <img
                  src={movie.poster || "https://via.placeholder.com/300x400"}
                  className="rounded-lg object-cover w-full h-[310px] sm:h-[430px] md:h-[500px] xl:h-[480px] lg:h-[300px] 2xl:h-[650px]"
                  alt={movie.title}
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-[#8b93b0] text-base xl:text-xl">
                  {new Date(movie.release_date).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center">
                  <img
                    src="/img/Star_fill.png"
                    className="Rating-Star w-3 h-3"
                    alt="Rating"
                  />
                  <span className="text-[#8b93b0] pl-2 text-base 2xl:text-xl">
                    {movie.rating ? movie.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-white text-xl lg:text-2xl xl:text-3xl font-bold pt-1">
                  {movie.title}
                </p>
              </div>
              <div className="flex gap-2 pt-3 flex-wrap">
                {movie.genre_names &&
                  movie.genre_names.split(", ").map((genre, index) => (
                    <button
                      key={index}
                      className="text-[#8b93b0] p-2 px-4 bg-[#2a304f] rounded-md"
                    >
                      {genre}
                    </button>
                  ))}
                {movie.language_names &&
                  movie.language_names.split(", ").map((lang, index) => (
                    <button
                      key={index}
                      className="text-[#c8cedd] p-2 px-4 bg-[#2a304f] rounded-md"
                    >
                      {lang}
                    </button>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#8b93b0] text-lg">No results found.</p>
        )}
      </div>
    </section>
  );
}
