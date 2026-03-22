import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((store) => store.user?.data);
  const role = user?.role;
  const isLoggedIn = Boolean(user);

  const [open, setOpen] = useState(false);
  const [pendingVettings, setPendingVettings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") return;
    axios
      .get(BASE_URL + "/admin/vettings/count", { withCredentials: true })
      .then((res) => setPendingVettings(res.data?.data?.pending || 0))
      .catch(() => {});
  }, [role]);
  const logo = import.meta.env.VITE_MEDWELL_LOGO;

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const NavItem = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-sm font-semibold text-gray-600 hover:text-[#e13429] transition"
    >
      {children}
    </Link>
  );

  const PrimaryLinkBtn = ({ to, children, onClick, className = "" }) => (
    <Link
      to={to}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center",
        "h-10 px-5 rounded-full",
        "bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );

  const OutlineBtn = ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      type="button"
      className={[
        "inline-flex items-center justify-center",
        "h-10 px-5 rounded-full",
        "border border-[#e13429] text-[#e13429] hover:bg-red-50 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Medwell Logo"
            className="h-10 object-contain"
            loading="eager"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn && (
            <>
              <NavItem to="/home">Home</NavItem>
              <NavItem to="/home/leaderboard">Leaderboard</NavItem>
              <NavItem to="/home/profile">Profile</NavItem>

              {role === "admin" && (
                <>
                  <NavItem to="/home/admin/applications">Applications</NavItem>
                  <NavItem to="/home/admin/createEvent">Create Event</NavItem>
                  <Link
                    to="/home/admin/vettings"
                    className="relative text-sm font-semibold text-gray-600 hover:text-[#e13429] transition"
                  >
                    Vettings
                    {pendingVettings > 0 && (
                      <span className="absolute -top-2 -right-4 h-4 min-w-4 px-1 rounded-full bg-[#e13429] text-white text-[10px] font-bold flex items-center justify-center">
                        {pendingVettings > 99 ? "99+" : pendingVettings}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </>
          )}

          {/* Login / Logout */}
          {isLoggedIn ? (
            <OutlineBtn onClick={handleLogout}>Logout</OutlineBtn>
          ) : (
            <PrimaryLinkBtn to="/login">Login</PrimaryLinkBtn>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden h-10 w-10 rounded-xl border border-gray-200 hover:bg-gray-50 transition inline-flex items-center justify-center"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-gray-700">
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
          open ? "max-h-[60vh]" : "max-h-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-4 bg-white/95 backdrop-blur">
          <div className="mt-3 bg-white border border-gray-200 rounded-3xl shadow-sm p-4 flex flex-col gap-3">
            {isLoggedIn && (
              <>
                <NavItem to="/home" onClick={() => setOpen(false)}>
                  Home
                </NavItem>

                <NavItem to="/home/leaderboard" onClick={() => setOpen(false)}>
                  Leaderboard
                </NavItem>

                <NavItem to="/home/profile" onClick={() => setOpen(false)}>
                  Profile
                </NavItem>

                {role === "admin" && (
                  <>
                    <NavItem to="/home/admin/applications" onClick={() => setOpen(false)}>
                      Applications
                    </NavItem>
                    <Link
                      to="/home/admin/vettings"
                      onClick={() => setOpen(false)}
                      className="relative w-fit text-sm font-semibold text-gray-600 hover:text-[#e13429] transition"
                    >
                      Vettings
                      {pendingVettings > 0 && (
                        <span className="absolute -top-2 -right-4 h-4 min-w-4 px-1 rounded-full bg-[#e13429] text-white text-[10px] font-bold flex items-center justify-center">
                          {pendingVettings > 99 ? "99+" : pendingVettings}
                        </span>
                      )}
                    </Link>
                  </>
                )}
              </>
            )}

            <div className="pt-2 border-t border-gray-200" />

            {isLoggedIn ? (
              <OutlineBtn
                className="justify-start"
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </OutlineBtn>
            ) : (
              <PrimaryLinkBtn
                to="/login"
                onClick={() => setOpen(false)}
                className="justify-start"
              >
                Login
              </PrimaryLinkBtn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;