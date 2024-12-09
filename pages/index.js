import { useState } from "react";
import Filter from "@/Components/filter.js";
import MoviesCard from "@/Components/movieCard.js";
import MoviesAffiliate from "@/Components/moviesAffilate.js";
import ResultFromFilter from "@/Components/resultFromFilter.js";
import Head from "next/head";
import Footer from "@/Components/footer.js";
import Navbar from "@/Components/navbar";

export default function Home() {
  const [filteredMovies, setFilteredMovies] = useState([]);

  return (
    <div>
      <Head>
        <title>หน้าแรก | Minor Cineplex</title>
      </Head>
      <div
        className="h-[480px] bg-cover bg-center -mt-44"
        style={{
          backgroundImage: "url('/img/header-mobile.jpg')",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundBlendMode: "darken",
        }}
      ></div>
      <Filter onFilterApply={(movies) => setFilteredMovies(movies)} />
      {/* <ResultFromFilter filteredMovies={filteredMovies} />  รอแก้ sprint 2 */}
      <MoviesCard />
      <MoviesAffiliate />
      <Footer />
    </div>
  );
}
