import { useState } from "react";
import Filter from "@/Components/landing-page/search-filter-movie.js";
import MoviesCard from "@/Components/landing-page/movie-card.js";
import MoviesAffiliate from "@/Components/landing-page/movies-affilate.js";
import Head from "next/head";
import Footer from "@/Components/page-sections/footer.js";

export default function Home() {
  const [filteredMovies, setFilteredMovies] = useState([]);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Head>
        <title>หน้าแรก | Minor Cineplex</title>
      </Head>
      <div
        className="h-[480px] bg-cover bg-center -mt-44 w-full"
        style={{
          backgroundImage: "url('/img/header-mobile.jpg')",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundBlendMode: "darken",
        }}
      ></div>
      <Filter onFilterApply={(movies) => setFilteredMovies(movies)} />
      <div className="flex flex-col p-4 md:p-8 2xl:p-0 max-w-[1500px] md:w-full">
        <MoviesCard />
        <MoviesAffiliate />
      </div>

      <Footer />
    </div>
  );
}
