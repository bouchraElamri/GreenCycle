import HeroImage from "../../assets/heroim.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
      <div id="hero" className="z-0 min-h-[80vh] md:min-h-[100vh] w-full overflow-hidden">
        <img src={HeroImage} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50 md:bg-black/35" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between p-0 mt-[13rem] md:mt-[13rem] 2xl:mt-[17rem] mx-6 md:mx-24 2xl:mx-38">
          <div></div>
          <div>
            <h1 className="text-[4rem] md:text-[4.5rem] 2xl:text-[6rem] font-nexa font-bold text-white-intense text-center">
              Shop the loop
            </h1>
            <p className="-mt-2 text-[2.2rem] md:text-[2.5rem] 2xl:text-[3.3rem] md:-mt-4 font-nexa text-white-intense text-center tracking-wider">
                for a sustainable future
            </p>
            <div className="flex justify-center gap-5 mt-3">
                <Link to="/product_list"> 
                <button className="w-[13rem] md:w-[15rem] 2xl:w-[20rem] h-[3.5rem] rounded-full text-[1.2rem] font-bold font-nexa text-white-intense transition-colors duration-300 bg-green-tolerated hover:bg-green-dark">Explore Products</button>
                </Link>
                <button className="w-[13rem] md:w-[15rem] 2xl:w-[20rem] h-[3.5rem] rounded-full text-[1.2rem] font-nexa text-white-intense bg-green/0 border border-white-intense transition-colors duration-300 hover:bg-white-intense/20">About us</button>
            </div>
          </div>
        </div>
          
      </div>
  );
};

export default Hero;
