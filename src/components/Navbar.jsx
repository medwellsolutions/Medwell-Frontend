import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const Navbar = () => {
  const userData = useSelector((store) => store.user);  // contains role
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logo = import.meta.env.VITE_MEDWELL_LOGO;

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Medwell Logo"
            className="h-10 object-contain"
            loading="eager"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/home" className="text-neutral-700 hover:text-indigo-600 font-medium">
            Home
          </Link>

          <Link to="/home/profile" className="text-neutral-700 hover:text-indigo-600 font-medium">
            Profile
          </Link>

          {/* ✅ Show only for Admin */}
          {userData?.data?.role === "admin" && (
            <Link
              to="/home/admin/applications"
              className="text-neutral-700 hover:text-indigo-600 font-medium"
            >
              Applications
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md border border-red-500 text-red-600 font-medium hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            {open ? (
              <path d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 1 1-1.4-1.4l4.9-4.9-4.9-4.9A1 1 0 1 1 7.1 4.3L12 9.2l4.9-4.9a1 1 0 0 1 1.4 0Z" />
            ) : (
              <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-40" : "max-h-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-4 flex flex-col gap-3 bg-white/95 backdrop-blur">
          <Link
            to="/home"
            className="py-2 text-neutral-700 hover:text-indigo-600 font-medium"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/home/profile"
            className="py-2 text-neutral-700 hover:text-indigo-600 font-medium"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          {/* ✅ Mobile view for Admin */}
          {userData?.role === "admin" && (
            <Link
              to="/home/admin/applications"
              className="py-2 text-neutral-700 hover:text-indigo-600 font-medium"
              onClick={() => setOpen(false)}
            >
              Applications
            </Link>
          )}

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="py-2 text-red-600 font-medium hover:bg-red-50 rounded-md text-left px-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
