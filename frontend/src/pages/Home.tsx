import Hero from "../components/layout/Hero";
import IntroSection from "./landing/IntroSection";
import Carousel from "./landing/carousel/Carousel";
import ShopNowSection from "./landing/ShopNowSection";
import KeyFeaturesSection from "./landing/KeyFeaturesSection";
import ReviewsSection from "./landing/ReviewsSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <IntroSection />
      <Carousel />
      <ShopNowSection />
      <KeyFeaturesSection />
      <ReviewsSection />
    </div>
  );
};

export default Home;
