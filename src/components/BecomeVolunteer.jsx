import React from "react";
import { useNavigate } from "react-router-dom";

const BecomeVolunteer = () => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/login");
  };

  return (
    <section
      className="relative isolate w-full bg-center bg-cover bg-no-repeat py-20 sm:py-24 lg:py-32 text-white"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop")',
      }}
      aria-label="Become a Volunteer"
    >
      <div className="absolute inset-0 -z-10 bg-black/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#e13429]/35 via-black/30 to-black/45" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-extrabold tracking-wide text-3xl sm:text-4xl lg:text-6xl">
          Become a Volunteer
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed">
          Join hands with a growing community committed to improving health,
          spreading awareness, and creating real impact through meaningful action.
        </p>

        <button
          onClick={login}
          className="mt-10 px-10 h-12 rounded-full bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-lg hover:scale-[1.03]"
        >
          Join With Us
        </button>
      </div>
    </section>
  );
};

export default BecomeVolunteer;
