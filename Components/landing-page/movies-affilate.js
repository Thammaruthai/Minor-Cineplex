import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { groupBy } from "@/utils/grouping";

export default function MoviesAffiliate() {
  const [cinemas, setCinemas] = useState([]);
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get("/api/cinemas/cinemas");

        setCinemas(response.data.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCinemas();
  }, []);

  const cities = groupBy(cinemas, "city");

  const gruoppedCity = Object.entries(cities);

  return (
    <section className="2xl:w-[1500px] lg:min-w-[1000px] p-5 md:p-10 lg:p-5 xl:p-0">
      <p className="text-4xl font-bold text-white my-11">All cinemas</p>
      {/* Bangkok */}
      {gruoppedCity && gruoppedCity.length > 0 ? (
        gruoppedCity.map(([city_name, cinemas]) => (
          <div key={city_name} className="flex flex-col">
            <p className="text-[#8b93b0] text-2xl font-semibold mb-5">
              {city_name}
            </p>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {cinemas.map((cinema) => (
                <Link
                  key={cinema.cinema_id}
                  href={`/cinemas/${cinema.cinema_id}`}
                >
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
                      <p className="text-white text-2xl font-bold">
                        {cinema.cinema_name}
                      </p>
                      <p className="text-[#8b93b0] text-base font-normal mt-1">
                        {cinema.address}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>
          <p>Cinema not found.</p>
        </div>
      )}
    </section>
  );
}
