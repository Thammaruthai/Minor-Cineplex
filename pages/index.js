import Footer from "@/Components/footer.js";
import Header from "../Components/header.js";
import Filter from "@/Components/filter.js";
import MoviesCard from "@/Components/movieCard.js";
import MoviesAffiliate from "@/Components/moviesAffilate.js";

export default function Home() {
  return (
    <div>
      <div
        class="h-[330px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/header-mobile.jpg')",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backgroundBlendMode: "darken",
        }}
      >
        <Header />
        <div class="mt-12">
          <Filter />
        </div>
      </div>

      <div class="mt-52">
        <MoviesCard />
      </div>
      <MoviesAffiliate />
      <Footer />
    </div>
  );
}
