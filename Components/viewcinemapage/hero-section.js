import { useCinema } from "@/hooks/useCinema";
import { Button } from "@chakra-ui/react";
import Image from "next/image";

export function HeroSectionCinema() {
  const { movie } = useCinema();
  if (movie.length === 0) {
    return;
  }
  const currentCinema = movie[0];
  return (
    <>
      <section className="md:flex md:relative w-full h-full justify-center lg:-mt-16">
        <div className="hidden md:flex md:relative w-full h-[440px] lg:h-[583px]">
          <Image
            src={currentCinema.cinemas.banner}
            alt={currentCinema.cinemas.name}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="w-full h-full opacity-60 object-contain"
          />
        </div>
        <div className="md:absolute lg:top-32 md:top-12 md:max-w-[1200px] md:h-[350px] lg:h-[400px] bg-[#070C1BB2] md:flex-row flex flex-col backdrop-blur-md bg-opacity-70 rounded-lg p-4 gap-6 md:p-0 md:gap-0 mb-12">
          <div className="flex md:gap-3 gap-6 ">
            <Image
              src={currentCinema.cinemas.poster}
              width={411}
              height={600}
              alt={currentCinema.cinemas.name}
              className="w-32 md:h-full md:w-[274px] h-44 object-cover"
            />
            <div className="lg:p-16 md:p-4 flex md:flex-col md:gap-12 w-full gap-6">
              <div className="flex flex-col gap-6">
                <h1 className="md:text-4xl text-2xl font-bold">
                  {currentCinema.cinemas.name}
                </h1>
                <div className="flex gap-2 flex-wrap">
                  <Button className="bg-[#21263F] p-3 text-[14px] text-[#8B93B0] rounded-md">
                    Hearing assistance
                  </Button>
                  <Button className="bg-[#21263F] p-3 text-[14px] text-[#8B93B0] rounded-md">
                    Wheelchair access
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex md:flex-col">
                <p className="text-[#C8CEDD]">
                  {currentCinema.cinemas.description}
                </p>
                <br />
                <p className="text-[#C8CEDD]">
                  {currentCinema.cinemas.description2}
                </p>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <p className="text-[#C8CEDD]">
              {currentCinema.cinemas.description}
            </p>
            <br />
            <p className="text-[#C8CEDD]">
              {currentCinema.cinemas.description2}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
