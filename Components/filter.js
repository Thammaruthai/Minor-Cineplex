export default function Filter() {
  return (
    <section class="bg-[#070C1B] mx-5 rounded-2xl shadow-lg  ">
      <div class=" p-5 rounded-lg max-w-md mx-auto">
        {/* Movie Dropdown */}
        <div class="mb-4">
          <select class="w-full border border-[#565f7e] p-2 py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none ">
            <option value="Movie">Movie</option>
            <option value="movie1">Movie 1</option>
            <option value="movie2">Movie 2</option>
          </select>
        </div>

        {/* Language and Genre */}
        <div class="flex justify-between gap-4 mb-4 ">
          <select class="flex-1 p-2 border border-[#565f7e]  py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none">
            <option value="">Language</option>
            <option value="english">English</option>
            <option value="spanish">Thai</option>
          </select>
          <select class="flex-1 p-2 border border-[#565f7e]  py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none">
            <option value="">Genre</option>
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
          </select>
        </div>

        {/* City and Release Date */}
        <div className="flex justify-between gap-4 mb-4">
          {/* City */}
          <div className="flex-1">
            <select className="w-full p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded focus:outline-none">
              <option value="city">City</option>
              <option value="Bangkok">Bangkok</option>
              <option value="Pathumthani">Pathumthani</option>
              <option value="Nonthaburi">Nonthaburi</option>
            </select>
          </div>

          {/* Release Date */}
          <div className="flex-1 relative">
            <div className="w-full p-2 border border-[#565f7e] py-4 bg-[#21263f] text-[#8b93b0] text-xl rounded cursor-pointer focus:outline-none flex items-center">
              <span className="text-gray-400">Release date</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <img
                  src="/img/Date_today_light.png"
                  alt="Calendar Icon"
                  className="h-5 w-5"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button class="w-20 h-14 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex justify-center items-center">
            <img src="/img/Search_light.png" alt="search" class="h-8" />
          </button>
        </div>
      </div>
    </section>
  );
}
