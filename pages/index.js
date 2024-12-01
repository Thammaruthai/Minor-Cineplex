import Filter from "@/Components/filter.js";
import MoviesCard from "@/Components/movieCard.js";
import MoviesAffiliate from "@/Components/moviesAffilate.js";
import Head from "next/head";
Head;

export default function Home() {
  return (
    <div>
      <Head>
        <title>หน้าแรก | Minor Cineplex</title>
      </Head>
      <div
        className="h-[480px] bg-cover bg-center -mt-44 "
        style={{
          backgroundImage: "url('/img/header-mobile.jpg')",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundBlendMode: "darken",
        }}
      ></div>
      <Filter />
      <MoviesCard />
      <MoviesAffiliate />
    </div>
  );
}
