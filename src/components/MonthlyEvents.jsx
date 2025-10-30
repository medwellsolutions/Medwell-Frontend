import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

const MonthlyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/events/November`, {
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
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading events...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
        November Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {events.map((event, index) => (
          <div
            key={index}
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
                <Link to= {`activity/${event._id}`}>
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
