export default function MoviesAffiliate() {
  return (
    <>
      <p className="text-4xl font-bold text-white my-11 mx-5 lg:mx-20">
        All cinemas
      </p>

      {/* Bangkok */}
      <p className="text-[#8b93b0] text-2xl font-semibold mb-5 mx-5 lg:mx-20">
        Bangkok
      </p>
      <div className="mx-5 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:mx-20">
        {/* Cinema 1 */}
        <div className="flex items-center border border-[#21263f] rounded-lg p-5 shadow-md">
          <div className="flex-none bg-[#2a304f] w-14 h-14 rounded-full flex items-center justify-center">
            <img
              src="/img/location.png"
              alt="Location Icon"
              className="w-5 h-6"
            />
          </div>
          <div className="ml-4">
            <p className="text-white text-2xl font-bold">The Icon</p>
            <p className="text-[#8b93b0] text-base font-normal mt-1">
              1224 Arkham, Arkham city
            </p>
          </div>
        </div>
      </div>

      {/* Pathumthani */}
      <p className="text-[#8b93b0] text-2xl font-semibold mb-5 mx-5 lg:mx-20">
        Pathumthani
      </p>
      <div className="mx-5 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:mx-20">
        {/* Cinema 1 */}
        <div className="flex items-center border border-[#21263f] rounded-lg p-5 shadow-md">
          <div className="flex-none bg-[#2a304f] w-14 h-14 rounded-full flex items-center justify-center">
            <img
              src="/img/location.png"
              alt="Location Icon"
              className="w-5 h-6"
            />
          </div>
          <div className="ml-4">
            <p className="text-white text-2xl font-bold">Future Park</p>
            <p className="text-[#8b93b0] text-base font-normal mt-1">
              Central Hall 79, Riddler factory, Arkham city
            </p>
          </div>
        </div>
      </div>

      {/* Nonthaburi */}
      <p className="text-[#8b93b0] text-2xl font-semibold mb-5 mx-5 lg:mx-20">
        Nonthaburi
      </p>
      <div className="mx-5 mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:mx-20">
        {/* Cinema 1 */}
        <div className=" flex items-center border border-[#21263f] rounded-lg p-5 shadow-md">
          <div className="flex-none bg-[#2a304f] w-14 h-14 rounded-full flex items-center justify-center">
            <img
              src="/img/location.png"
              alt="Location Icon"
              className="w-5 h-6"
            />
          </div>
          <div className="ml-4">
            <p className="text-white text-2xl font-bold">Central Westgate</p>
            <p className="text-[#8b93b0] text-base font-normal mt-1">
              1224 Triconrner, Arkham city
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
