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
  const changeSlide = (val) => {
    setSlideNo((crr) => (crr + val + slides.length) % slides.length);
  };

  const s = slides[slideNo];

  return (
    <section className="relative">
      {/* Responsive height: a bit shorter on phones, taller on md+ */}
      <div className="relative h-[58vh] sm:h-[62vh] md:h-[72vh] lg:h-[78vh]">
        <img
          src={s.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
        />
        {/* Slightly stronger overlay on small screens for readability */}
        <div className="absolute inset-0 bg-black/45 sm:bg-black/40" />

        <div className="relative z-10 h-full">
          <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl text-white">
              {/* Fluid, responsive title sizing with tighter leading on mobile */}
              <h1 className="font-extrabold leading-tight text-[clamp(1.9rem,6vw,3.75rem)] md:text-6xl">
                <span className="block">{s.title1}</span>
                <span className="block">
                  {s.title2.replace("$10", "")}
                  <span className="text-orange-400">$10</span>
                </span>
              </h1>

              {s.subtitle && (
                <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-200">
                  {s.subtitle}
                </p>
              )}

              <a
                className="mt-5 sm:mt-6 inline-flex items-center rounded-md bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base"
              >
                Getting Started
              </a>
            </div>
          </div>
        </div>

        {/* Left arrow (bigger tap target on mobile, slightly inset) */}
        <button
          onClick={() => changeSlide(-1)}
          aria-label="Prev"
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/75 hover:bg-white p-2 sm:p-2.5 z-20 shadow"
        >
          <svg
            width="20"
            height="20"
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

        {/* Right arrow */}
        <button
          onClick={() => changeSlide(1)}
          aria-label="Next"
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/75 hover:bg-white p-2 sm:p-2.5 z-20 shadow"
        >
          <svg
            width="20"
            height="20"
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
