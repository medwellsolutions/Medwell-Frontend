import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const Header = () => {
  const role = useSelector((store) => store.user?.data?.role);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logo = import.meta.env.VITE_MEDWELL_LOGO;

  const handleLogin = async () => {
    try {
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 py-2px">
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:grid grid-cols-[auto_1fr] grid-rows-2 px-4 py-2">
        
        {/* Logo */}
        <div className="row-span-2 flex items-center pr-6">
          <Link to="/" className="inline-flex items-center">
            <img
              src={logo}
              alt="Medwell Solutions"
              className="h-14 object-contain"
            />
          </Link>
        </div>

        {/* Top row: Search / Help / Contact */}
        <div className="flex justify-end items-center py-[1px]">
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-500 leading-tight">
            <button className="flex items-center gap-2 hover:text-slate-700">
              🔍 <span>Search</span>
            </button>
            <button className="hover:text-slate-700">Help</button>
            <button className="hover:text-slate-700">Contact</button>
          </nav>
        </div>

        {/* Bottom row: ONLY Login */}
        <div className="flex justify-end items-center py-[2px]">
          <nav className="flex items-center gap-8 text-[15px] font-medium text-neutral-700 leading-tight">
            <button
              onClick={handleLogin}
              className="px-5 py-2 rounded-md border border-green-600 text-green-700 hover:bg-green-50 transition"
            >
              Login
            </button>
          </nav>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden">
        {/* Top bar */}
        <div className="px-4 h-14 flex items-center justify-between border-b border-neutral-200 bg-white">
          <Link to="/">
            <img
              src={logo}
              alt="Medwell Solutions"
              className="h-11 object-contain"
            />
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-neutral-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
              {open ? (
                <path d="M18.3 5.7 13.4 12l4.9 4.9-1.4 1.4L12 13.4l-4.9 4.9-1.4-1.4L10.6 12 5.7 7.1l1.4-1.4L12 10.6l4.9-4.9Z" />
              ) : (
                <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
              )}
            </svg>
          </button>
        </div>

        {/* Utilities */}
        <div className="px-4 h-12 flex justify-end items-center bg-white">
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <button className="hover:text-slate-700">Search</button>
            <button className="hover:text-slate-700">Help</button>
            <button className="hover:text-slate-700">Contact</button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="px-4 pb-4 bg-white border-t border-neutral-200 flex flex-col gap-3">
            {role === "admin" && (
              <Link to="/home/admin/applications">Applications</Link>
            )}

            <button
              onClick={handleLogin}
              className="text-green-700 font-medium text-left hover:bg-green-50 px-2 py-2 rounded"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
