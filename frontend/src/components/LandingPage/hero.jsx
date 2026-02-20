import HeroImage from "../../assets/heroim.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <section id="hero" className="relative min-h-[90vh] w-full overflow-hidden">
        {/* Background */}
        <img
          src={HeroImage}
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Content */}
        <div className="relative md:top-20 z-10 mx-6 md:mx-10 xl:mx-24 2xl:mx-40 py-24 md:py-28 xl:py-32">
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2 md:gap-6 xl:gap-0">
            <h1 className="font-nexa font-bold text-white-intense text-[50px] md:text-[60px] xl:text-[79px] leading-tight">
              Shop the loop
            </h1>

            <p className="font-nexa text-white-intense text-[24px] md:text-[36px] xl:text-[48px] leading-tight">
              for a sustainable future
            </p>

            <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-end">
              <Link to="/product_list" className="inline-flex">
                <button className="h-10 md:h-14 xl:h-16 px-6 md:px-10 xl:px-14 rounded-full bg-green-tolerated hover:bg-green-dark text-white-intense font-nexa font-bold transition-colors duration-300 text-sm md:text-base xl:text-lg">
                  Explore Products
                </button>
              </Link>

              <button className="h-10 md:h-14 xl:h-16 px-6 md:px-10 xl:px-14 rounded-full border-2 border-white-intense text-white-intense font-nexa font-bold hover:bg-white-intense/10 transition-colors duration-300 text-sm md:text-base xl:text-lg">
                About us
              </button>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/25 to-transparent" />
      </section>

      <section className="bg-black h-96" />
      <section className="bg-black h-96" />
    </div>
  );
};

export default Hero;
