"use client";
import { DateSection } from "@/Components/view-movie-page/date-section";
import Footer from "@/Components/page-sections/footer";
import Navbar from "@/Components/page-sections/navbar";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
} from "@/components/ui/progress-circle";
import { useCinema } from "@/hooks/useCinema";
import { HeroSectionCinema } from "@/Components/view-cinema-page/hero-section";
import MovieSection from "@/Components/view-cinema-page/movies-section";

export default function ViewCinema() {
  const { movie, date, loading, setDate, setLoading } = useCinema();

  return (
    <>
      <section className="w-full h-full flex flex-col items-center text-white my-2">
        {movie && movie.length > 0 ? (
          <>
            <HeroSectionCinema />
            <DateSection
              date={date}
              setDate={setDate}
              setLoading={setLoading}
            />
            <MovieSection
              movie={movie}
              date={date}
              loading={loading}
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
