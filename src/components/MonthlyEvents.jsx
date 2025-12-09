import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const MonthlyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [month, setMonth] = useState(currentMonth);

  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/events/${month}`, {
          withCredentials: true,
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [month]);

  if (loading)
    return <p className="text-center text-gray-500">Loading events...</p>;

  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          {month} Events
        </h2>

        {/* FILTER BUTTON + PANEL */}
        <div className="relative">
          <button
            onClick={() => setShowFilter((prev) => !prev)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow text-sm font-medium"
          >
            Filters
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg p-4 z-10">
              {/* Month Filter */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                className="w-full border p-2 rounded-lg text-gray-700 mb-4 text-sm"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Placeholder for future filters */}
              {/* Add more fields here later: Year, Category, etc. */}

              <button
                onClick={() => setShowFilter(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {events.map((event) => (
          <div
            key={event._id}
            className="border rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all bg-gray-50 hover:scale-[1.02]"
          >
            <img
              src={event.imageUrl}
              alt={event.name}
              className="w-full h-56 sm:h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {event.name}
              </h3>
              <p className="text-gray-600 text-base mt-3 line-clamp-3">
                {event.caption}
              </p>

              <div className="mt-4 text-sm text-gray-500">
                <p>
                  <strong>Starts:</strong>{" "}
                  {new Date(event.startsAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Ends:</strong>{" "}
                  {new Date(event.endsAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link to={`event/${event._id}`}>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg transition">
                    Participate
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-gray-500 mt-6 text-sm">
          No events found for this month.
        </p>
      )}
    </div>
  );
};

export default MonthlyEvents;
