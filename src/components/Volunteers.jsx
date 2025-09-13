import React from "react";

const VOLUNTEERS = [
  {
    name: "Gabriel Watkins",
    role: "Volunteers",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop", // swap with your image
  },
  {
    name: "Veronica Cooper",
    role: "Volunteers",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Jessica Anderson",
    role: "Volunteers",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1400&auto=format&fit=crop",
  },
];

const Volunteers = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      {/* Heading */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-gray-500 text-3xl sm:text-3xl lg:text-4xl font-bold tracking-wide">
          MEET OUR VOLUNTEERS
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-500">
          Tellus integer feugiat scelerisque varius morbi enim nunc. Tempus
          egestas sed sed risus pretium.
        </p>
      </div>

      {/* Grid */}
      <div className="mx-auto mt-10 sm:mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
          {VOLUNTEERS.map((v) => (
            <article key={v.name} className="group">
              {/* Big image */}
              <div className="overflow-hidden">
                <img
                  src={v.img}
                  alt={v.name}
                  className="h-[280px] sm:h-[340px] lg:h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Name + role */}
              <div className="mt-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {v.name}
                </h3>
                <p className="mt-1 text-gray-500 text-base sm:text-lg">
                  {v.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Volunteers;
