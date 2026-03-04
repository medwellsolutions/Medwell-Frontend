import React from "react";

const VOLUNTEERS = [
  {
    name: "Gabriel Watkins",
    role: "Volunteer",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Veronica Cooper",
    role: "Volunteer",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Jessica Anderson",
    role: "Volunteer",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1400&auto=format&fit=crop",
  },
];

/**
 * Medwell Theme (keep 2/3/4):
 * - Warm peach/orange gradient vibe (signup)
 * - White rounded cards with gentle shadow
 * - Soft gray borders
 * - Primary CTA color: #e13429
 * - Friendly/pastel, restrained
 */
const Volunteers = () => {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      {/* subtle pastel blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />

      {/* Heading */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center justify-center gap-2">
          <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
            Community
          </span>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
            People
          </span>
        </div>

        <h2 className="mt-4 text-slate-900 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Meet Our Volunteers
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600">
          The people powering Medwell’s community impact—showing up, supporting
          causes, and helping others thrive.
        </p>

        {/* accent underline */}
        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-[#e13429]/70 via-rose-300/70 to-amber-300/60" />
      </div>

      {/* Grid */}
      <div className="mx-auto mt-10 sm:mt-14 max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
          {VOLUNTEERS.map((v, idx) => (
            <article key={v.name} className="group relative">
              {/* playful frame */}
              <div
                className={`absolute -inset-2 rounded-3xl border border-white/50 ${
                  idx % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.6deg]"
                }`}
              />
              <div
                className={`absolute -inset-2 rounded-3xl border border-[#e13429]/20 ${
                  idx % 2 === 0
                    ? "translate-x-[2px] translate-y-[2px]"
                    : "-translate-x-[2px] translate-y-[2px]"
                }`}
              />

              {/* Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur border border-slate-200/80 shadow-[0_12px_32px_rgba(15,23,42,0.10)]">
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={v.img}
                    alt={v.name}
                    className="h-[280px] sm:h-[340px] lg:h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Name + role */}
                <div className="px-6 py-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {v.name}
                  </h3>
                  <p className="mt-1 text-slate-600 text-sm sm:text-base">
                    {v.role}
                  </p>

                  <button
                    type="button"
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[#e13429] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#c92d25] active:bg-[#b82620] transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/35"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Volunteers;