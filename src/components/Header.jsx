import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const role = useSelector((store) => store.user?.data?.role);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logo = import.meta.env.VITE_MEDWELL_LOGO;

  const handleLogin = () => navigate("/login");

  const PrimaryBtn = ({ children, className = "", ...rest }) => (
    <button
      {...rest}
      className={[
        "h-11 rounded-full px-6 text-white font-medium",
        "bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  const OutlineBtn = ({ children, className = "", ...rest }) => (
    <button
      {...rest}
      className={[
        "h-11 rounded-full px-6 font-medium",
        "border border-[#e13429] text-[#e13429] hover:bg-red-50 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  const NavLink = ({ children, to, href, onClick }) => {
    const cls = "text-sm font-semibold text-gray-600 hover:text-[#e13429] transition";
    if (to) return <Link to={to} onClick={onClick} className={cls}>{children}</Link>;
    return <a href={href} onClick={onClick} className={cls}>{children}</a>;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-3">
          {logo ? (
            <img src={logo} alt="Medwell Solutions" className="h-12 object-contain" />
          ) : (
            <div className="text-lg font-extrabold text-gray-900">
              Medwell<span className="text-[#e13429]">.</span>
            </div>
          )}
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <button
              type="button"
              className="text-sm font-semibold text-gray-600 hover:text-[#e13429] transition"
            >
              Help
            </button>
            <NavLink href="#contactUs">Contact</NavLink>

            {role === "admin" && (
              <NavLink to="/home/admin/applications">Applications</NavLink>
            )}
          </nav>

          <PrimaryBtn type="button" onClick={handleLogin} className="px-8">
            Login
          </PrimaryBtn>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden">
        {/* Top bar */}
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center">
            {logo ? (
              <img src={logo} alt="Medwell Solutions" className="h-10 object-contain" />
            ) : (
              <div className="text-base font-extrabold text-gray-900">
                Medwell<span className="text-[#e13429]">.</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition inline-flex items-center justify-center"
            aria-label={open ? "Close menu" : "Open menu"}
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              {open ? (
                <path d="M18.3 5.7 13.4 12l4.9 4.9-1.4 1.4L12 13.4l-4.9 4.9-1.4-1.4L10.6 12 5.7 7.1l1.4-1.4L12 10.6l4.9-4.9Z" />
              ) : (
                <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
              )}
            </svg>
          </button>
        </div>

        {/* Utilities row */}
        <div className="px-4 h-12 flex justify-end items-center">
          <div className="flex gap-6">
            <button
              type="button"
              className="text-sm font-semibold text-gray-600 hover:text-[#e13429] transition"
            >
              Help
            </button>
            <a href="#contactUs" className="text-sm font-semibold text-gray-600 hover:text-[#e13429] transition">
              Contact
            </a>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="px-4 pb-4 border-t border-gray-200 bg-white">
            <div className="mt-3 border border-gray-200 rounded-3xl shadow-sm p-4 flex flex-col gap-3">
              {role === "admin" && (
                <Link
                  to="/home/admin/applications"
                  onClick={() => setOpen(false)}
                >
                  <OutlineBtn type="button" className="w-full justify-start">
                    Applications
                  </OutlineBtn>
                </Link>
              )}

              <PrimaryBtn
                type="button"
                onClick={() => {
                  setOpen(false);
                  handleLogin();
                }}
                className="w-full justify-start"
              >
                Login
              </PrimaryBtn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;