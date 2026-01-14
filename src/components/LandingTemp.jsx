import React from 'react'
import About from './About'
import Campaigns from './Campaigns'
import BecomeVolunteer from './BecomeVolunteer'
import ContactUs from './ContactUs'
import Footer from './Footer'
import Header from './Header'
import HeroSection from './HeroSection'
import Navbar from './Navbar'
import StatsStrip from './StatsStrip'



const LandingTemp = () => {
  return (
    <>
        <Header/>
        <HeroSection />
        <Campaigns/>
        <About/>
        <StatsStrip />
        <BecomeVolunteer />
        <ContactUs />

    </>
  )
}

export default LandingTemp