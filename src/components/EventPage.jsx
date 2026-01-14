import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/event/${eventId}`, {
          withCredentials: true,
        });
        setEvent(data.event);
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      }
    };

    loadEvent();
  }, [eventId]);

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!event) return <p className="text-center mt-10">Loading...</p>;

  const hasVolunteerCredit =
    event.volunteerHours &&
    typeof event.volunteerHours.isAvailable === "boolean";

  const hasEstimatedTime =
    event.estimatedTime && event.estimatedTime.text?.trim()?.length > 0;

  const startDate = event.startsAt
    ? new Date(event.startsAt).toLocaleString()
    : "";
  const endDate = event.endsAt
    ? new Date(event.endsAt).toLocaleString()
    : "";

  const getActionLink = (step) => `/event/${eventId}/step/${step.stepNumber}`;

  return (
    <div className="w-full min-h-screen bg-white">
      {/* BANNER */}
      <div className="relative w-full h-[350px] overflow-hidden">
        <img
          src={event.bannerImageUrl}
          className="w-full h-full object-cover"
          alt="Event Banner"
        />

        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-10">
          <h1 className="text-white text-4xl font-bold max-w-4xl">
            {event.name}
          </h1>
          <p className="text-white text-lg max-w-3xl mt-2">
            {event.caption}
          </p>
        </div>

        <Link
          to={`/home/event/${eventId}/step/1`}
          state={{ event }}                 
          className="absolute bottom-6 right-6 bg-white text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-neutral-200 transition-all"
        >
          Get Started →
        </Link>

      </div>

      {/* INFO ROW (dispersed) */}
      <div className="px-10 py-6 border-b">
        <div className="max-w-6xl flex flex-wrap justify-between gap-y-4 gap-x-10">
          <div className="min-w-160px">
            <p className="text-sm font-bold">MONTH:</p>
            <p className="font-bold">{event.month}</p>
          </div>

          <div className="min-w-160px">
            <p className="text-sm font-bold ">STARTS AT:</p>
            <p className="font-bold">{startDate || "Not specified"}</p>
          </div>

          <div className="min-w-160px">
            <p className="text-sm font-bold">ENDS AT</p>
            <p className="font-bold">{endDate || "Not specified"}</p>
          </div>

          <div className="min-w-160px">
            <p className="text-sm font-bold ">
              VOLUNTEER CREDIT:
            </p>
            <p className="font-bold">
              {hasVolunteerCredit
                ? event.volunteerHours.isAvailable
                  ? "YES"
                  : "NO"
                : "Not specified"}
            </p>
          </div>

          <div className="min-w-160px">
            <p className="text-sm font-bold ">
              ESTIMATED TIME TO COMPLETE:
            </p>
            <p className="font-bold">
              {hasEstimatedTime ? event.estimatedTime.text : "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT + ACTION STEPS */}
      <div className="flex w-full px-10 py-10 gap-10 relative">
        {/* LEFT CONTENT – bigger, thicker typography */}
        <div className="w-full lg:w-[65%] space-y-8 text-[18px] leading-[1.7]">
          {/* Short description */}
          <p className="text-[19px] font-semibold">
            {event.shortDescription}
          </p>

          {/* Long description */}
          <div className="space-y-4">
            {event.longDescription
              ?.split("\n")
              .filter((line) => line.trim().length > 0)
              .map((para, idx) => (
                <p key={idx} className="text-[18px]">
                  {para}
                </p>
              ))}
          </div>

          {/* Highlight Banner */}
          {event.highlightText && (
            <div className="w-full bg-[#4628FF] text-[#FFD06A] py-10 px-6 rounded-xl text-center my-10">
              <p className="text-2xl font-semibold italic">
                {event.highlightText}
              </p>
            </div>
          )}

          {/* Requirements */}
          {event.requirements?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-3 text-[18px]">
                {event.requirements.map((req) => (
                  <li key={req._id}>
                    <p className="font-semibold">{req.title}</p>
                    {req.description && (
                      <p className="text-gray-700">{req.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* FAQs */}
          {event.FAQs?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Volunteer Credit FAQs</h2>
              <div className="space-y-4 text-[18px]">
                {event.FAQs.map((faq) => (
                  <div key={faq._id}>
                    <p className="font-semibold">Q: {faq.question}</p>
                    <p className="text-gray-700">
                      A: {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT STICKY ACTION STEPS */}
        <div className="hidden lg:block w-[35%]">
          <div className="sticky top-20 bg-black text-white p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold mb-6">Action Steps</h3>

            {event.actionSteps?.length > 0 ? (
              <div className="flex flex-col space-y-6">
                {event.actionSteps.map((step) => {
                  const isDone = step.isCompleted === true;

                  return (
                    <div
                      key={step._id || step.stepNumber}
                      className="flex items-center gap-4"
                    >
                      {/* Circle */}
                      <div
                        className={
                          "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold " +
                          (isDone
                            ? "bg-green-500 border-green-500 text-black"
                            : "border-green-500 text-green-500")
                        }
                      >
                        {isDone ? "✓" : step.stepNumber}
                      </div>

                      {/* Clickable Title */}
                      <Link to={getActionLink(step)} className="no-underline">
                        <p className="font-bold uppercase tracking-wide hover:text-green-400 transition">
                          {step.title}
                        </p>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm opacity-80">No action steps added.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
