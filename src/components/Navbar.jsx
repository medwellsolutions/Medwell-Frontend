import React, { useState } from "react";

const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Events", href: "#campaigns" },
  { label: "Pages", href: "/#pages" },
  { label: "News", href: "/#news" },
  { label: "Contact Us", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className=" sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" className="text-orange-500">
            <path className="fill-current" d="M12 21s-7.5-4.35-9.33-8.82C1.82 8.86 4.02 6 7.08 6c1.6 0 3.05.8 3.92 2.02C11.87 6.8 13.32 6 14.92 6 17.98 6 20.18 8.86 21.33 12.18 19.5 16.65 12 21 12 21Z"/>
          </svg>
          <span className="text-xl text-black font-semibold">Medwell Solutions</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-neutral-700 hover:text-neutral-900">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop search */}
        <label className="hidden md:flex input bg-inherit border-none focus-within:border-black">
          <svg className="h-[1em] text-black" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required className="text-black" placeholder="Search" />
        </label>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            {open ? (
              <path d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 1 1-1.4-1.4l4.9-4.9-4.9-4.9A1 1 0 1 1 7.1 4.3L12 9.2l4.9-4.9a1 1 0 0 1 1.4 0Z"/>
            ) : (
              <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu (slide-down) */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-4 flex flex-col gap-3 bg-white/95 backdrop-blur">
          {/* Mobile search */}
          <label className="input bg-inherit border-none focus-within:border-black">
            <svg className="h-[1em] text-black" viewBox="0 0 24 24">
              <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required className="text-black" placeholder="Search" />
          </label>

          {/* Mobile links */}
          <nav className="flex flex-col">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="py-2 text-neutral-700 hover:text-neutral-900"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
