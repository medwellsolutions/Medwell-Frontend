import React from "react";

const About = () => {
  const ceoImage = import.meta.env.VITE_MEDWELL_CEO_IMAGE;

  return (
    <section id="about" className="relative bg-[#f8fafc] py-16 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-60 bg-[#e13429]/10" />
      <div className="absolute -bottom-16 -left-24 w-72 h-72 rounded-full blur-3xl opacity-60 bg-[#e13429]/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center md:justify-start">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[1.75rem] border border-gray-200 rotate-[-1deg]" />

            <img
              src={ceoImage}
              alt="Medwell CEO"
              className="relative max-h-[480px] w-[380px] rounded-[1.75rem] object-cover shadow-xl border border-gray-200 bg-white"
              loading="lazy"
            />

            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900">Founder & CEO</p>
              <p className="text-sm text-gray-600">Medwell</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
            About Medwell
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed">
            Medwell is a community-driven platform built to make{" "}
            <span className="font-semibold text-[#e13429]">
              health awareness, prevention, and participation
            </span>{" "}
            accessible to everyone.
          </p>

          <p className="text-base sm:text-lg text-gray-700 mb-8 leading-relaxed">
            We believe a healthier tomorrow starts with informed choices today.
            By connecting people with meaningful health-focused causes,
            volunteering opportunities, and awareness campaigns, Medwell helps
            individuals turn care into action — and action into impact.
          </p>

          <div className="border-l-4 border-[#e13429] pl-5 mb-8">
            <p className="italic text-base sm:text-lg text-gray-700 leading-relaxed">
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
                className="rounded-2xl bg-white p-5 border border-gray-200 shadow-md"
              >
                <h4 className="font-bold text-lg mb-1 text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
                <div className="mt-4 h-1.5 w-10 rounded-full bg-[#e13429]/80" />
              </div>
            ))}
          </div>

          <p className="text-sm sm:text-base text-gray-600">
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
