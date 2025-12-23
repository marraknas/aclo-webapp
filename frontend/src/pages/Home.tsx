import Hero from "../components/layout/Hero";
import IntroSection from "../components/landing/IntroSection";
import Carousel from "../components/landing/carousel/Carousel";
import ShopNowSection from "../components/landing/ShopNowSection";
import KeyFeaturesSection from "../components/landing/KeyFeaturesSection";
import ReviewsSection from "../components/landing/ReviewsSection";

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
