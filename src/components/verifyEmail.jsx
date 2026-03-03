import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const calledRef = useRef(false); // ✅ prevents double API call in StrictMode

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token missing.");
      return;
    }

    // ✅ stop second execution (React StrictMode runs effects twice in dev)
    if (calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/verify-email?token=${token}`, {
          withCredentials: true,
        });

        setStatus("success");
        setMessage(res?.data?.message || "Email verified successfully.");

        // redirect to login
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8 text-center">
        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold">Verifying...</h2>
            <p className="text-gray-500 mt-2">Please wait.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-xl font-semibold text-green-600">Verified ✅</h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <p className="text-gray-400 mt-2 text-sm">
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-600 mt-2">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full bg-indigo-600 text-white rounded-lg py-2 font-medium hover:bg-indigo-700 transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;