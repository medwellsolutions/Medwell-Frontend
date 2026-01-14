import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

/**
 * LandingCampaignsPreview
 * - Shows ONLY first 3 events (no filters, no extra icons)
 * - DoSomething-like section heading + 3 cards
 * - Medwell theme:
 *   - Main heading: blue
 *   - Content: light blue
 *   - Slightly funky (subtle border/offset frame), not overdone
 */
const Campaigns = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentMonth = useMemo(
    () => new Date().toLocaleString("default", { month: "long" }),
    []
  );

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BASE_URL}/events/${currentMonth}`, {
          withCredentials: true,
        });

        // Only first 3
        const firstThree = Array.isArray(res.data) ? res.data.slice(0, 3) : [];
        setEvents(firstThree);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentMonth]);

  if (loading) {
    return (
      <section className="bg-blue-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sky-600 font-medium">
            Loading campaigns...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-blue-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-red-600 font-medium">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="causes" className="bg-blue-50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading (DoSomething-ish) */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-700">
            CREATING A HEALTHIER TOMORROW
          </h2>
          <p className="mt-3 text-base sm:text-lg text-sky-600">
            Take part in meaningful health causes and turn awareness into real-world impact.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={event._id} className="relative">
              {/* subtle funky offset frame */}
              <div
                className={`absolute -inset-2 rounded-3xl border-2 border-blue-200 ${
                  i === 1 ? "rotate-[1.2deg]" : "rotate-[-1deg]"
                }`}
              />
              <div className="relative rounded-3xl overflow-hidden bg-white border border-blue-200 shadow-sm hover:shadow-md transition">
                {/* Image */}
                <div className="relative">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />

                  {/* label chip (blue bg + white text rule) */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-semibold">
                      CAMPAIGN
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-blue-700">
                    {event.name}
                  </h3>

                  <p className="mt-3 text-sky-600 text-sm leading-relaxed line-clamp-4">
                    {event.caption}
                  </p>

                  {/* Dates (small, light blue) */}
                  <div className="mt-4 text-xs text-sky-600">
                    <p>
                      <span className="font-semibold text-blue-700">
                        Starts:
                      </span>{" "}
                      {new Date(event.startsAt).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-700">Ends:</span>{" "}
                      {new Date(event.endsAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-6">
                    <Link to={`/home/event/${event._id}`}>
                      <button className="w-full rounded-2xl bg-blue-700 text-white font-semibold py-3 hover:bg-blue-800 transition">
                        Participate →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* If no events */}
        {events.length === 0 && (
          <p className="text-center text-sky-600 mt-10">
            No featured campaigns found for this month.
          </p>
        )}

        {/* Bottom CTA like the screenshot */}
        <div className="mt-10 flex justify-center">
          <Link to="/home">
            <button className="px-10 py-3 rounded-xl bg-blue-900 text-white font-semibold hover:bg-blue-950 transition">
              Explore More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
