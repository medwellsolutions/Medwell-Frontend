import { useState } from "react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("");

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
    setUnverifiedEmail("");
    setResendStatus("");
    try {
      await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password, phone, location, role },
        { withCredentials: true }
      );
      setIsLoginForm(true);
      setError("");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.code === "UNVERIFIED") {
        setUnverifiedEmail(emailId);
        setError(data.message);
      } else {
        setError(data?.message || data || "Try again");
      }
    }
  };

  const resendVerification = async () => {
    setResendStatus("sending");
    try {
      const res = await axios.post(BASE_URL + "/resend-verification", { emailId: unverifiedEmail });
      setResendStatus(res.data?.message || "Verification email sent.");
    } catch (err) {
      setResendStatus(err?.response?.data?.message || "Failed to resend. Try again.");
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
          {!isLoginForm && (
            <p className="mt-2 text-xs text-gray-500">
              Fields marked <span className="text-[#e13429] font-bold">*</span> are required
            </p>
          )}

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
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 pr-11 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                    Email address <span className="text-[#e13429]">*</span>
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
                    First name <span className="text-[#e13429]">*</span>
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
                    Last name <span className="text-[#e13429]">*</span>
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
                    Phone <span className="text-[#e13429]">*</span>
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
                    Location <span className="text-[#e13429]">*</span>
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
                    Role <span className="text-[#e13429]">*</span>
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
                    Password <span className="text-[#e13429]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full border border-gray-200 rounded-xl px-4 pr-11 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="sm:col-span-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 space-y-2">
                    <p>{error}</p>
                    {unverifiedEmail && (
                      <div>
                        <button
                          type="button"
                          onClick={resendVerification}
                          disabled={typeof resendStatus === "string" && resendStatus !== "" && resendStatus !== "sending"}
                          className="text-[#e13429] font-semibold underline hover:text-[#c62d23] disabled:opacity-50"
                        >
                          {resendStatus === "sending" ? "Sending…" : "Resend verification email"}
                        </button>
                        {resendStatus && resendStatus !== "sending" && (
                          <p className="mt-1 text-green-700">{resendStatus}</p>
                        )}
                      </div>
                    )}
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