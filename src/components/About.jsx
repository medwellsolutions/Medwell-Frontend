import React from "react";

const About = () => {
  const ceoImage = import.meta.env.VITE_MEDWELL_CEO_IMAGE;

  return (
    <section id="about" className="relative bg-white py-16 overflow-hidden">
      {/* subtle funky background accent */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-70" />
      <div className="absolute bottom-0 -left-20 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Image (CEO) */}
        <div className="flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl border-2 border-blue-200 rotate-[-1deg]" />
            <img
              src={ceoImage}
              alt="Medwell CEO"
              className="relative max-h-[480px] w-[380px] rounded-3xl object-cover shadow-md"
              loading="lazy"
            />
            <div className="mt-4">
              <p className="text-lg font-semibold text-blue-700">
                Founder & CEO
              </p>
              <p className="text-sm text-sky-600">
                Medwell
              </p>
            </div>

          </div>
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-blue-700 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            About Medwell
          </h2>

          <p className="text-lg sm:text-xl text-sky-600 mb-6 leading-relaxed">
            Medwell is a community-driven platform built to make{" "}
            <span className="font-semibold text-blue-700">
              health awareness, prevention, and participation
            </span>{" "}
            accessible to everyone.
          </p>

          <p className="text-base sm:text-lg text-sky-600 mb-8 leading-relaxed">
            We believe a healthier tomorrow starts with informed choices today.
            By connecting people with meaningful health-focused causes,
            volunteering opportunities, and awareness campaigns, Medwell helps
            individuals turn care into action — and action into impact.
          </p>

          <div className="border-l-4 border-blue-600 pl-5 mb-8">
            <p className="italic text-base sm:text-lg text-sky-600 leading-relaxed">
              “Small actions, when taken together, create powerful change.
              Medwell exists to make those actions visible, meaningful, and
              shared.”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { title: "Awareness", desc: "Knowledge that empowers healthier decisions." },
              { title: "Community", desc: "People supporting people, together." },
              { title: "Impact", desc: "Real actions with measurable outcomes." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-blue-700 text-white p-5 shadow-sm"
              >
                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                <p className="text-sm text-blue-100">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base text-sky-600">
            Whether you’re taking your first step or leading a movement,
            Medwell is here to help you build a healthier future — for yourself
            and for others.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
