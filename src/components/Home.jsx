import React from "react";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import About from "./About";
import Campaigns from "./Campaigns";
import StatsStrip from "./StatsStrip";
import Volunteers from "./Volunteers";
import BecomeVolunteer from "./BecomeVolunteer";
import ContactUs from "./ContactUs";

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <About/>
      <Campaigns/>
      <StatsStrip/>
      <Volunteers/>
      <BecomeVolunteer/>
      <ContactUs/>
    </>
  );
};

export default Home;