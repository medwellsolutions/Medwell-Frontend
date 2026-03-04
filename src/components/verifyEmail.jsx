import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

/**
 * Medwell Theme (keep 2/3/4):
 * - Login page: clean white / very light tint background (#f8fafc vibe)
 * - Primary button: #e13429
 * - Soft gray borders, rounded cards, friendly/pastel but restrained
 */
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const calledRef = useRef(false); // prevents double API call in StrictMode

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token missing.");
      return;
    }

    if (calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/verify-email?token=${token}`, {
          withCredentials: true,
        });

        setStatus("success");
        setMessage(res?.data?.message || "Email verified successfully.");

        setTimeout(() => navigate("/login"), 1500);
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            err?.response?.data ||
            "Invalid or expired token."
        );
      }
    })();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)] p-8 text-center">
          {/* tiny friendly chips */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
              Medwell
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
              Email
            </span>
          </div>

          {status === "loading" && (
            <>
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-[#e13429] animate-spin" />
              </div>

              <h2 className="text-xl font-extrabold text-slate-900">
                Verifying…
              </h2>
              <p className="text-slate-600 mt-2">Please wait.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-700 font-extrabold">
                ✓
              </div>

              <h2 className="text-xl font-extrabold text-emerald-700">
                Verified
              </h2>
              <p className="text-slate-600 mt-2">{message}</p>
              <p className="text-slate-400 mt-2 text-sm">
                Redirecting to login…
              </p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-full bg-[#e13429] py-3 font-extrabold text-white hover:bg-[#c92d25] active:bg-[#b82620] transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/35"
              >
                Go to Login
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-rose-200 bg-rose-50 flex items-center justify-center text-rose-700 font-extrabold">
                !
              </div>

              <h2 className="text-xl font-extrabold text-rose-700">
                Verification Failed
              </h2>
              <p className="text-slate-600 mt-2">{message}</p>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 w-full rounded-full bg-[#e13429] py-3 font-extrabold text-white hover:bg-[#c92d25] active:bg-[#b82620] transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/35"
              >
                Go to Login
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-3 w-full rounded-full border border-slate-200 bg-white py-3 font-extrabold text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/25"
              >
                Back to Home
              </button>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          If this keeps failing, request a new verification email from the login
          page.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;