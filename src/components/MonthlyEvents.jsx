import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

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

  const Card = ({ className = "", children }) => (
    <div className={`bg-white border border-gray-200 rounded-3xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  const OutlineBtn = ({ className = "", ...props }) => (
    <button
      {...props}
      className={[
        "h-11 rounded-full px-5 font-medium",
        "border border-[#e13429] text-[#e13429] hover:bg-red-50 transition",
        className,
      ].join(" ")}
    />
  );

  const PrimaryBtn = ({ className = "", ...props }) => (
    <button
      {...props}
      className={[
        "h-11 rounded-full px-6 font-medium text-white",
        "bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm",
        className,
      ].join(" ")}
    />
  );

  const Select = ({ className = "", ...props }) => (
    <select
      {...props}
      className={[
        "h-11 rounded-2xl px-4 bg-white w-full",
        "border border-gray-200 text-gray-900",
        "focus:outline-none focus:ring-2 focus:ring-[#e13429]/30",
        className,
      ].join(" ")}
    />
  );

  if (loading) {
    return (
      <div className="min-h-[40vh] bg-[#f8fafc] grid place-items-center px-4">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-[#e13429] animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading events…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] bg-[#f8fafc] grid place-items-center px-4">
        <div className="max-w-xl w-full rounded-3xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] px-4 sm:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                {month} Events
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Explore campaigns and participate to create impact.
              </p>
            </div>

            {/* Filter */}
            <div className="relative self-start sm:self-auto">
              <OutlineBtn
                onClick={() => setShowFilter((prev) => !prev)}
                type="button"
              >
                Filters
              </OutlineBtn>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-3xl shadow-lg p-4 z-10">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-extrabold text-gray-900">Filter</p>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-xl border border-gray-200 hover:bg-gray-50 transition inline-flex items-center justify-center"
                      onClick={() => setShowFilter(false)}
                      aria-label="Close filters"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Month Filter */}
                  <label className="text-sm font-semibold text-gray-700">
                    Month
                  </label>
                  <div className="mt-2">
                    <Select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <PrimaryBtn
                    onClick={() => setShowFilter(false)}
                    className="w-full mt-4"
                    type="button"
                  >
                    Apply Filters
                  </PrimaryBtn>

                  <p className="text-xs text-gray-500 mt-3">
                    More filters (year/category) can be added here later.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {events.map((event, i) => (
              <div key={event._id} className="relative">
                {/* subtle offset frame */}
                <div
                  className={[
                    "absolute -inset-2 rounded-3xl border border-gray-200",
                    i % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]",
                  ].join(" ")}
                />

                <div className="relative border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-56 sm:h-64 object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-extrabold text-gray-900">
                      {event.name}
                    </h3>

                    <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
                      {event.caption}
                    </p>

                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                      <p>
                        <span className="font-semibold text-[#e13429]">Starts:</span>{" "}
                        {event.startsAt ? new Date(event.startsAt).toLocaleDateString() : "—"}
                      </p>
                      <p>
                        <span className="font-semibold text-[#e13429]">Ends:</span>{" "}
                        {event.endsAt ? new Date(event.endsAt).toLocaleDateString() : "—"}
                      </p>
                    </div>

                    <div className="mt-6">
                      <Link to={`event/${event._id}`}>
                        <PrimaryBtn className="w-full">
                          Participate →
                        </PrimaryBtn>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty */}
          {events.length === 0 && (
            <div className="mt-8 text-center bg-gray-50 border border-gray-200 rounded-3xl p-6">
              <p className="text-gray-600">No events found for this month.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MonthlyEvents;