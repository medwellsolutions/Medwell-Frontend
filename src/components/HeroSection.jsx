import React, { useState } from "react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    title1: "Help Poor Childrens",
    title2: "Only From $10",
    subtitle: "We Are Non-Profit Charity & NGO Organization.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1600&auto=format&fit=crop",
    title1: "We Are Non-Profit Charity",
    title2: "& NGO Organization.",
    subtitle: "",
  },
];

const HeroSection = () => {
  
  const [slideNo, setSlideNo] = useState(0);
  const changeSlide = (val)=>{
    setSlideNo((crr)=>{
      const nw = (crr+val+slides.length)%slides.length;
      return nw;
    })
  }

  const s = slides[slideNo];

  return (
    <section className="relative">
      <div className="relative h-[64vh] md:h-[72vh]">
        <img
          src={s.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full">
          <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                <span className="block">{s.title1}</span>
                <span className="block">
                  {s.title2.replace("$10", "")}
                  <span className="text-orange-400">$10</span>
                </span>
              </h1>
              {s.subtitle && (
                <p className="mt-4 text-lg text-neutral-200">{s.subtitle}</p>
              )}
              <a
                // href="#get-started"
                className="mt-6 inline-flex items-center rounded-md bg-orange-500 hover:bg-orange-600 text-white px-6 py-3"
              >
                Getting Started
              </a>
            </div>
          </div>
        </div>

        {/* Left arrow */}
        <div>
        <button
          onClick = {()=>{changeSlide(-1)}}
          aria-label="Prev"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white p-2 z-20"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="stroke-neutral-800"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        </div>

        {/* Right arrow */}
        <button
          onClick = {()=>{changeSlide(1)}}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white p-2 z-20"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="stroke-neutral-800"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
