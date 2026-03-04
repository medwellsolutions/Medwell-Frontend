import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logo = import.meta.env.VITE_MEDWELL_LOGO;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      const nextRoute = res?.data?.data?.nextRoute;
      navigate(nextRoute);
    } catch (err) {
      setError(err?.response?.data || "Try again");
    }
  };

  const signup = async () => {
    try {
      await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password, phone, location, role },
        { withCredentials: true }
      );
      setIsLoginForm(true);
      setError("");
    } catch (err) {
      setError(err?.response?.data || "Try again");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* LEFT HERO */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            {logo ? (
              <img src={logo} alt="Medwell Logo" className="h-14 w-auto" />
            ) : (
              <div className="px-3 py-1 rounded-full bg-white/70 border border-gray-200 text-sm font-semibold">
                Medwell
              </div>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-bold text-gray-800 leading-tight">
            Join the Cause.
            <br />
            Make an Impact.
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            Takes less than a minute to sign up.
          </p>

          {/* TOGGLE PILLS */}
          <div className="mt-7 inline-flex rounded-full bg-white/80 p-1 border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setIsLoginForm(true);
                setError("");
              }}
              className={`px-6 py-2 text-sm rounded-full transition ${
                isLoginForm
                  ? "bg-[#e13429] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLoginForm(false);
                setError("");
              }}
              className={`px-6 py-2 text-sm rounded-full transition ${
                !isLoginForm
                  ? "bg-[#e13429] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Create account
            </button>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isLoginForm ? "Welcome back" : "Create your account"}
            </h2>
            <span className="text-xs text-gray-500">
              {isLoginForm ? "Login" : "Sign up"}
            </span>
          </div>

          <div className="mt-6">
            {isLoginForm ? (
              <div className="space-y-4">

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="text"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={login}
                  className="w-full h-12 rounded-full bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-md"
                >
                  Login
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  By continuing, you agree to our Terms & Privacy Policy.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* EMAIL */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="text"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {/* FIRST NAME */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {/* LAST NAME */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {/* ROLE */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  >
                    <option value="">Select Role</option>
                    <option value="supplier">Supplier</option>
                    <option value="participant">Participant</option>
                    <option value="non-profit">Non-profit</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>

                {/* PASSWORD */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  />
                </div>

                {error && (
                  <div className="sm:col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={signup}
                    className="w-full h-12 rounded-full bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-md"
                  >
                    Create account
                  </button>

                  <p className="mt-3 text-center text-xs text-gray-500">
                    Nonprofit-linked • No medical data collected
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;