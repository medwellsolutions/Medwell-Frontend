import React from "react";

const features = [
  { title: "Our Mission", desc: "Purus in mollis nunc sed. Lacus suspendisse faucibus." },
  { title: "Our Program", desc: "Nunc pulvinar sapien et ligula. Natoque penatibus." },
  { title: "Support 24/7", desc: "Tempor id volutpat facilisis iaculis morbi iaculis." },
  { title: "Become Volunteer", desc: "Ultricies integer quis auctor elit sed. Magna eget est." },
];

const FeatureSection = () => {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 text-center hover:shadow-md transition"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center shadow">
                <svg width="26" height="26" viewBox="0 0 24 24" className="fill-orange-500">
                  <path d="M12 21s-7.5-4.35-9.33-8.82C1.82 8.86 4.02 6 7.08 6c1.6 0 3.05.8 3.92 2.02C11.87 6.8 13.32 6 14.92 6 17.98 6 20.18 8.86 21.33 12.18 19.5 16.65 12 21 12 21Z"/>
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-neutral-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
