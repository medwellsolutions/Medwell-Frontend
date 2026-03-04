import React, { useEffect, useMemo, useRef, useState } from "react";

const STATS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
        <path
          d="M7 4h10l2.5 2 2.5 1.5-2 4H18v8H6v-8H4L2 7.5 4.5 6 7 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 9.2c-1.3 0-2.3 1-2.3 2.3 0 1.7 2.3 3.5 2.3 3.5s2.3-1.8 2.3-3.5c0-1.3-1-2.3-2.3-2.3Z"
          fill="currentColor"
        />
      </svg>
    ),
    value: "200+",
    label: "Volunteers",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
        <path
          d="M12 6.5c.9-1.2 2.9-1.2 3.8 0 .7.9.6 2.2-.2 3l-3.6 3.6L8.4 9.5c-.8-.8-.9-2.1-.2-3 .9-1.2 2.9-1.2 3.8 0Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
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
        <circle
          cx="12"
          cy="12"
          r="8.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M9.2 10.1c-.8-1-.4-2.6 1-3.1.9-.3 1.8.1 2.3.8.5-.7 1.4-1 2.3-.8 1.4.5 1.8 2.1 1 3.1-1.1 1.4-3.3 3-3.3 3s-2.2-1.6-3.3-3Z"
          fill="currentColor"
        />
      </svg>
    ),
    value: "80+",
    label: "Campaign",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10">
        <circle
          cx="12"
          cy="8"
          r="4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M9 13l-3 8 6-3 6 3-3-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "20+",
    label: "Awards",
  },
];

// ---------- helpers ----------
const parseStatValue = (valueStr) => {
  const suffixMatch = valueStr.match(/[^\d,]+$/);
  const suffix = suffixMatch ? suffixMatch[0] : "";
  const num = Number(valueStr.replace(/[^\d]/g, "")) || 0;
  return { num, suffix };
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Medwell theme (keep 2/3/4):
 * - soft peach/orange gradient backdrop + friendly pastel feel
 * - white rounded cards with gentle shadow + soft gray borders
 * - primary CTA color: #e13429 (coral/red)
 * - restrained playful accents (tiny tilt/outline)
 */
const StatsStrip = ({
  bg = "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1920&auto=format&fit=crop",
}) => {
  const sectionRef = useRef(null);
  const rafRef = useRef(null);

  const parsed = useMemo(() => STATS.map((s) => parseStatValue(s.value)), []);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState(() => parsed.map(() => 0));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) setHasAnimated(true);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);

      const nextCounts = parsed.map((p) => Math.round(p.num * eased));
      setCounts(nextCounts);

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hasAnimated, parsed]);

  return (
    <section
      ref={sectionRef}
      className="my-10 sm:my-14 lg:my-20 relative isolate w-full overflow-hidden py-12 sm:py-14 lg:py-20"
      aria-label="Organization statistics"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url("${bg}")` }}
      />

      {/* Warm peach/coral overlay (keeps readability + matches signup vibe) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50/70 via-rose-50/70 to-amber-50/70" />

      {/* Soft dark veil for contrast without making it gloomy */}
      <div className="absolute inset-0 -z-10 bg-slate-900/40" />

      {/* Decorative soft blobs (pastel, restrained) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-rose-200/25 blur-3xl -z-10" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => {
            const suffix = parsed[i]?.suffix ?? "";
            const valueToShow = hasAnimated ? counts[i] : 0;

            return (
              <div key={i} className="relative">
                {/* tiny playful offset frame (pastel + coral accent) */}
                <div
                  className={`absolute -inset-2 rounded-3xl border ${
                    i % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.6deg]"
                  } border-white/25`}
                />
                <div
                  className={`absolute -inset-2 rounded-3xl ${
                    i % 2 === 0 ? "translate-x-[2px] translate-y-[2px]" : "-translate-x-[2px] translate-y-[2px]"
                  } border border-[#e13429]/25`}
                />

                <div className="relative rounded-3xl bg-white/90 border border-slate-200/80 backdrop-blur px-6 py-7 text-center shadow-[0_10px_26px_rgba(15,23,42,0.12)] hover:shadow-[0_14px_34px_rgba(15,23,42,0.16)] transition">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 p-3 text-[#e13429]">
                    {s.icon}
                  </div>

                  {/* Value */}
                  <div className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                    {valueToShow.toLocaleString()}
                    {suffix}
                  </div>

                  {/* Label */}
                  <div className="mt-2 text-sm sm:text-base text-slate-600">
                    {s.label}
                  </div>

                  {/* micro underline accent */}
                  <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#e13429]/70 via-rose-300/70 to-amber-300/60" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional small caption */}
        <div className="mt-8 text-center text-xs sm:text-sm text-white/85">
          Built with community-first impact.
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;