import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function MoviesAffiliate() {
  const [cinemas, setCinemas] = useState([]);
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const response = await axios.get("/api/cinemas/cinemas");
        console.log(`Response`, response.data);
        setCinemas(response.data.data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCinemas();
  }, []);

  console.log(`Cinema`, cinemas);
  return (
    <>
      <p className="text-4xl font-bold text-white my-11 mx-5 lg:mx-20">
        All cinemas
      </p>
      {/* Bangkok */}
      {cinemas && cinemas.length > 0 ? (
        cinemas.map((cinema) => (
          <>
            <p
              key={cinema.cinema_id}
              className="text-[#8b93b0] text-2xl font-semibold mb-5 mx-5 lg:mx-20"
            >
              {cinema.city}
            </p>
            <Link href={`/cinemas/${cinema.cinema_id}`}>
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
                    <p className="text-white text-2xl font-bold">
                      {cinema.cinema_name}
                    </p>
                    <p className="text-[#8b93b0] text-base font-normal mt-1">
                      {cinema.address}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </>
        ))
      ) : (
        <div>
          <p>Cinema not found.</p>
        </div>
      )}
    </>
  );
}
