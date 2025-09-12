import React, { useEffect, useState } from "react";

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
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  const go = (d) => setIdx((i) => (i + d + slides.length) % slides.length);

  const s = slides[idx];

  return (
    <section className="relative">
      <div className="relative h-[64vh] md:h-[72vh]">
        <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
              {s.subtitle && <p className="mt-4 text-lg text-neutral-200">{s.subtitle}</p>}
              <a
                href="#get-started"
                className="mt-6 inline-flex items-center rounded-md bg-orange-500 hover:bg-orange-600 text-white px-6 py-3"
              >
                Getting Started
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={() => go(-1)}
          aria-label="Prev"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white p-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" className="fill-neutral-800">
            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white p-2"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" className="fill-neutral-800">
            <path d="m10 6 1.41 1.41L8.83 10H20v2H8.83l2.58 2.59L10 16l-6-6 6-6z"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
