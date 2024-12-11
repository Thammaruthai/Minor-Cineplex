"use client";
import { HeroSection } from "@/Components/view-movie-page/hero-section";
import { DateSection } from "@/Components/view-movie-page/date-section";
import { CinemaSection } from "@/Components/view-movie-page/cinemas-section";
import Footer from "@/Components/page-sections/footer";
import Navbar from "@/Components/page-sections/navbar";
import { useMovie } from "@/hooks/useMovies";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";

export default function ViewMovie() {
  const {
    movie,
    city,
    date,
    inputSearch,
    loading,
    setCity,
    setCinema,
    setDate,
    setInputSearch,
    setLoading,
  } = useMovie();
  console.log(`Movie:`, movie);
  return (
    <>
      <section className="w-full h-full flex flex-col items-center text-white -mt-16">
        {movie && movie.length > 0 ? (
          <>
            <HeroSection />
            <DateSection
              date={date}
              setDate={setDate}
              setLoading={setLoading}
            />
            <CinemaSection
              movie={movie}
              city={city}
              date={date}
              loading={loading}
              inputSearch={inputSearch}
              setInputSearch={setInputSearch}
              setCity={setCity}
              setCinema={setCinema}
              setLoading={setLoading}
            />
          </>
        ) : (
          <div className="flex justify-center items-center gap-3 mt-28">
            <div>
              <ProgressCircleRoot value={null} size="sm">
                <ProgressCircleRing cap="round" />
              </ProgressCircleRoot>
            </div>
            <p>Loading...</p>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
