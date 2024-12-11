import { useState } from "react";
import Filter from "@/Components/landing-page/search-filter-movie.js";
import MoviesCard from "@/Components/landing-page/movie-card.js";
import MoviesAffiliate from "@/Components/landing-page/movies-affilate.js";
import ResultFromFilter from "@/Components/search-result/search-result.js";
import Head from "next/head";
import Footer from "@/Components/page-sections/footer.js";
import Navbar from "@/Components/page-sections/navbar";

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
