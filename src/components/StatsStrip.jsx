import React from "react";

const STATS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
        <path d="M7 4h10l2.5 2 2.5 1.5-2 4H18v8H6v-8H4L2 7.5 4.5 6 7 4Z"
              fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 9.2c-1.3 0-2.3 1-2.3 2.3 0 1.7 2.3 3.5 2.3 3.5s2.3-1.8 2.3-3.5c0-1.3-1-2.3-2.3-2.3Z"
              fill="currentColor" />
      </svg>
    ),
    value: "200+",
    label: "Volunteers",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
        <path d="M12 6.5c.9-1.2 2.9-1.2 3.8 0 .7.9.6 2.2-.2 3l-3.6 3.6L8.4 9.5c-.8-.8-.9-2.1-.2-3 .9-1.2 2.9-1.2 3.8 0Z"
              fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="6" cy="7.5" r="1.6" fill="currentColor" />
        <circle cx="18" cy="7.5" r="1.6" fill="currentColor" />
      </svg>
    ),
    value: "5000+",
    label: "Donation",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9.2 10.1c-.8-1-.4-2.6 1-3.1.9-.3 1.8.1 2.3.8.5-.7 1.4-1 2.3-.8 1.4.5 1.8 2.1 1 3.1-1.1 1.4-3.3 3-3.3 3s-2.2-1.6-3.3-3Z"
              fill="currentColor" />
      </svg>
    ),
    value: "80+",
    label: "Campaign",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
        <circle cx="12" cy="8" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 13l-3 8 6-3 6 3-3-8"
              fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    value: "20+",
    label: "Awards",
  },
];

const StatsStrip = ({
  bg="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1920&auto=format&fit=crop",
}) => {
  return (
    <section
      className="my-10 sm:my-14 lg:my:20 
        relative isolate w-full
        bg-center bg-cover bg-no-repeat
        py-10 sm:py-14 lg:py-20
      "
      style={{ backgroundImage: `url("${bg}")` }}
      aria-label="Organization statistics"
    >
      {/* Readable overlay */}
      <div className="absolute inset-0 -z-10 bg-black/55" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            grid gap-8 sm:gap-10 lg:gap-12
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            text-center text-white
          "
        >
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-orange-500">{s.icon}</div>

              {/* Numbers scale by breakpoint */}
              <div className="mt-3 sm:mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide">
                {s.value}
              </div>

              {/* Labels scale + soften color */}
              <div className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-neutral-200">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
