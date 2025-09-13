import React from "react";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import About from "./About";
import Campaigns from "./Campaigns";
import StatsStrip from "./StatsStrip";
import Volunteers from "./Volunteers";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <About/>
      <Campaigns/>
      <StatsStrip/>
      <Volunteers/>
    </>
  );
};

export default Home;