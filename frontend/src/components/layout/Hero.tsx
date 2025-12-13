import { Link } from "react-router-dom";
import heroImg from "../../assets/hero-img1.jpg";
import Navbar from "../common/Navbar";
import { assets, cloudinaryImageUrl } from "../../constants/cloudinary";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={cloudinaryImageUrl(assets.hero.publicId)}
        alt={assets.hero.alt}
        className="w-full h-[500px] md:h-[700px] lg:h-[760px] object-cover"
      />

      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      <div className="absolute inset-0 bg-white/20 flex items-center justify-left">
        <div className="text-left text-accent1 p-6 pl-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tighter mb-2">
            Empowering <br /> Independence
          </h1>
          <p className="text-base sm:text-lg md:text-3xl lg:text-4xl xl:text-5xl tracking-wide mb-4 font-light">
            One Home at a Time.
          </p>
          <Link
            to="/collections/all"
            className="
				inline-flex items-center justify-center
				bg-acloblue text-background font-light rounded-xl
				text-sm sm:text-base md:text-lg
				px-2 py-2 sm:px-7 sm:py-1 md:px-8 md:py-2
			"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
