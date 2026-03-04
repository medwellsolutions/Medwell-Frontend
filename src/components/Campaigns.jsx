import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

/**
 * LandingCampaignsPreview
 * - Shows ONLY first 3 events
 * - Medwell theme: clean light background, red primary (#e13429)
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
      <section className="bg-[#f8fafc] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg text-[#e13429]"></span>
          </div>
          <p className="text-center text-gray-600 font-medium mt-4">
            Loading campaigns...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-[#f8fafc] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="causes" className="bg-[#f8fafc] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Creating a Healthier Tomorrow
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600">
            Channel your passion into action with these featured health causes.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={event._id} className="relative">
              <div
                className={`absolute -inset-2 rounded-3xl border border-gray-200 ${
                  i === 1 ? "rotate-[1.2deg]" : "rotate-[-1deg]"
                }`}
              />

              <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition">
                <div className="relative">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-56 object-cover"
                    loading="lazy"
                  />

                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 border border-gray-200 text-xs font-semibold text-[#e13429]">
                      Campaign
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    {event.name}
                  </h3>

                  <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {event.caption}
                  </p>

                  <div className="mt-4 text-xs text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-900">Starts:</span>{" "}
                      {event.startsAt ? new Date(event.startsAt).toLocaleDateString() : "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Ends:</span>{" "}
                      {event.endsAt ? new Date(event.endsAt).toLocaleDateString() : "-"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <Link to={`/home/event/${event._id}`}>
                      <button className="w-full h-11 rounded-2xl bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-md">
                        Participate →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No featured campaigns found for this month.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <Link to="/home">
            <button className="h-12 px-10 rounded-full bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-md">
              Explore More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Campaigns;
