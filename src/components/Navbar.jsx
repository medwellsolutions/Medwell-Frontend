import React, { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#about" },
  { label: "Events", href: "/#events" },
  { label: "Pages", href: "/#pages" },
  { label: "News", href: "/#news" },
  { label: "Contact Us", href: "/#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
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

        <label className="input bg-inherit border-none focus-within:border-black">
          <svg className="h-[1em] text-black"   viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search"  required className = "text-black" placeholder="Search" />
        </label>

      </div>
    </div>
  );
};

export default Navbar;
