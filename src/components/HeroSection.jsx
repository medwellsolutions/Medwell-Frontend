import React, { useEffect, useMemo, useState } from "react";

const HeroSection = () => {
  const slides = useMemo(
    () => [
      {
        highlight: "build healthier communities?",
        caption:
          "Join health-focused causes, track your impact, and inspire a better tomorrow.",
      },
      {
        highlight: "spread health awareness?",
        caption:
          "Take action with simple challenges and share verified impact with your community.",
      },
      {
        highlight: "earn verified volunteer credits?",
        caption:
          "Log hours, submit proof, and grow your profile with real-world contributions.",
      },
    ],
    []
  );

  const stories = useMemo(
    () => [
      {
        title: "Aanya hosted a hygiene drive",
        desc: "and helped distribute essentials to families in need.",
      },
      {
        title: "Arjun completed a mental wellness challenge",
        desc: "and encouraged 30+ friends to participate too.",
      },
      {
        title: "Sana logged 12 volunteer hours",
        desc: "supporting a local nonprofit health camp.",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setAnimKey((k) => k + 1);
    }, 4200);
    return () => clearInterval(t);
  }, [slides.length]);

  const active = slides[index];
  const activeStory = stories[index % stories.length];

  return (
    <section className="w-full bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <h1 className="font-extrabold tracking-tight leading-[1.05]">
              <span className="block text-4xl sm:text-5xl lg:text-6xl text-gray-900">
                Want to
              </span>

              <span
                key={animKey}
                className="block text-4xl sm:text-5xl lg:text-6xl text-[#e13429] animate-[fadeSlideIn_.45s_ease-out]"
              >
                {active.highlight}
              </span>

              <span className="block text-4xl sm:text-5xl lg:text-6xl text-gray-900">
                We’ll help you do it!
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl">
              {active.caption}
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#causes"
                className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-[#e13429] text-white font-semibold hover:bg-[#c62d23] transition shadow-md"
              >
                Start taking action →
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Track your impact • Build your profile • Create a better tomorrow
            </p>
          </div>

          {/* RIGHT */}
          <div className="relative">

            {/* background blobs */}
            <div className="absolute -top-12 -right-10 w-72 h-72 rounded-full blur-3xl opacity-60 bg-[#e13429]/10" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full blur-3xl opacity-60 bg-sky-500/10" />

            {/* decorative frame */}
            <div className="absolute -inset-3 rounded-3xl border border-gray-200 rotate-[-1deg]" />

            <div className="relative rounded-3xl bg-white border border-gray-200 shadow-lg p-6 sm:p-8">

              {/* Spotlight Card */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Impact spotlight
                    </p>
                    <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                      {activeStory.title}
                    </h3>
                  </div>

                  <div className="flex gap-2 mt-1">
                    {slides.map((_, i) => (
                      <span
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i === index ? "bg-[#e13429]" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-white border border-gray-200 p-6">
                  <p className="text-sm text-gray-600">{activeStory.desc}</p>
                  <p className="mt-3 text-xs text-gray-500">
                    Verified on Medwell • Community-driven
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    className="text-gray-600 hover:text-[#e13429] transition"
                    onClick={() => {
                      const next = (index - 1 + slides.length) % slides.length;
                      setIndex(next);
                      setAnimKey((k) => k + 1);
                    }}
                  >
                    ←
                  </button>

                  <button
                    className="text-gray-600 hover:text-[#e13429] transition"
                    onClick={() => {
                      const next = (index + 1) % slides.length;
                      setIndex(next);
                      setAnimKey((k) => k + 1);
                    }}
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Bottom strip */}
              <div className="mt-5 rounded-xl bg-gray-900 text-white px-6 py-4">
                <p className="text-sm opacity-90">
                  Join thousands of people taking health actions with Medwell.
                </p>
                <a
                  href="#impact"
                  className="text-sm font-semibold underline"
                >
                  Learn more about impact →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0px); }
          }
        `}
      </style>
    </section>
  );
};

export default HeroSection;