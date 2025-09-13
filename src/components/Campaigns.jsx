import React from "react";

const campaigns = [
  {
    id: 1,
    title: "Childrens",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1400&auto=format&fit=crop",
    raised: 560,
    goal: 200000,
    donors: 7,
    percent: 0.28,
  },
  {
    id: 2,
    title: "Food",
    image:
      "https://www.sos-childrensvillages.org/getmedia/89afa257-6362-40a2-a561-3f57b368726f/Day-of-the-African-Child_600x300.jpg?width=600&height=300&ext=.jpg",
    raised: 305,
    goal: 150000,
    donors: 5,
    percent: 0.2,
  },
  {
    id: 3,
    title: "Education",
    image:
      "https://images.squarespace-cdn.com/content/v1/58e26c28893fc0a495c5e7d8/35c292b2-4466-41c1-b210-5658071f6ac1/Photo+1_Africa+Day+blog_header.png",
    raised: 0,
    goal: 1000,
    donors: 0,
    percent: 0.0,
  },
];

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const Campaigns = () => {
  return (
    <section className="relative">
      {/* Top banner */}
      <div
        className="relative min-h-[44vh] sm:min-h-[52vh] lg:min-h-[60vh] bg-center bg-auto bg-no-repeat"
        style={{
            backgroundImage: `url("https://nbcnews.shorthandstories.com/mica-mined-madagascar/assets/vnxvjPUGHZ/opener-1920x1080.jpeg")`,
        }}
        >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
            <div className="max-w-3xl">
            <h2 className="text-white font-extrabold tracking-wide text-3xl sm:text-4xl lg:text-5xl">
                LATEST CAMPAIGN
            </h2>
            <p className="mt-4 text-neutral-200 text-lg sm:text-xl">
                Quis vel eros donec ac odio tempor orci. Urna condimentum mattis
                pellentesque id nibh tortor id aliquet.
            </p>
            </div>
         </div>
        </div>
      {/* Cards (overlap the banner slightly) */}
      <div className="-mt-16 md:-mt-20 relative z-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:px-8 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <article
              key={c.id}
              className="bg-white/95 backdrop-blur rounded-md shadow-md overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-56 w-full object-cover"
                />

                {/* Percent ribbon */}
                <div className="absolute left-3 -bottom-3">
                  <span className="inline-block bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {`${(c.percent).toFixed(2)}%`}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-neutral-800">
                  {c.title}
                </h3>

                <button className="mt-6 inline-flex items-center rounded-md bg-orange-500 px-5 py-3 text-white font-semibold hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  DONATE NOW
                </button>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-neutral-200" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-neutral-500">Raised</p>
                    <p className="font-semibold text-orange-600">
                      {currency(c.raised)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Goal</p>
                    <p className="font-semibold text-orange-600">
                      {currency(c.goal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Donor</p>
                    <p className="font-semibold text-neutral-800">{c.donors}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
