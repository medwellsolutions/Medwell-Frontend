import React from "react";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import About from "./About";
import Campaigns from "./Campaigns";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <About/>
      <Campaigns/>
    </>
  );
};

export default Home;