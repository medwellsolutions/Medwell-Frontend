import React from "react";
import { useNavigate } from "react-router-dom";

const BecomeVolunteer = () => {
    const navigate = useNavigate();
    const login = ()=>{navigate('/login')}
  return (
    <section
      className="
        relative isolate w-full
        bg-center bg-cover bg-no-repeat
        py-16 sm:py-20 lg:py-28
        text-white
      "
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop")',
      }}
      aria-label="Become a Volunteer"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-extrabold tracking-wide text-3xl sm:text-4xl lg:text-6xl">
          BECOME A VOLUNTEER
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg lg:text-xl text-neutral-200">
  Join hands with a growing community committed to improving health, spreading awareness,
  and creating real impact through meaningful action.
</p>


        <a
          onClick={login}
          className="
            mt-8 inline-flex items-center justify-center
            rounded-full px-8 py-4
            text-base sm:text-lg font-semibold
            bg-orange-500 hover:bg-orange-600
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-offset-2 focus-visible:ring-orange-300
          "
        >
          JOIN WITH US
        </a>
      </div>
    </section>
  );
};

export default BecomeVolunteer;
