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
          <span className="text-xl font-semibold">Medwell Solutions</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-neutral-700 hover:text-neutral-900">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button aria-label="Search" className="rounded-full p-2 hover:bg-neutral-100">
            <svg width="20" height="20" viewBox="0 0 24 24" className="fill-neutral-700">
              <path d="M21 21 16.65 16.65M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
            </svg>
          </button>
          <a href="#donate" className="rounded-md bg-orange-500 hover:bg-orange-600 text-white px-4 py-2">
            Donate Now
          </a>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden rounded-md p-2 hover:bg-neutral-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-neutral-800">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-neutral-200">
          <nav className="px-4 py-3 space-y-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block rounded px-2 py-2 hover:bg-neutral-100"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2 flex items-center gap-3">
              <button className="rounded-full p-2 hover:bg-neutral-100" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-neutral-700">
                  <path d="M21 21 16.65 16.65M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"/>
                </svg>
              </button>
              <a
                href="#donate"
                className="rounded-md bg-orange-500 hover:bg-orange-600 text-white px-3 py-2"
                onClick={() => setOpen(false)}
              >
                Donate Now
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
