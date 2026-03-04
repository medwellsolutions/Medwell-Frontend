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

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] grid place-items-center px-4">
        <div className="max-w-xl w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f8fafc] grid place-items-center px-4">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-[#e13429] animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading event...</p>
        </div>
      </div>
    );
  }

  const hasVolunteerCredit =
    event.volunteerHours && typeof event.volunteerHours.isAvailable === "boolean";

  const hasEstimatedTime =
    event.estimatedTime && event.estimatedTime.text?.trim()?.length > 0;

  const startDate = event.startsAt ? new Date(event.startsAt).toLocaleString() : "";
  const endDate = event.endsAt ? new Date(event.endsAt).toLocaleString() : "";

  const getActionLink = (step) => `/event/${eventId}/step/${step.stepNumber}`;

  const Pill = ({ children }) => (
    <span className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs text-white">
      {children}
    </span>
  );

  const Card = ({ children, className = "" }) => (
    <div className={`bg-white border border-gray-200 rounded-3xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  const PrimaryButton = ({ children, className = "" }) => (
    <button
      className={[
        "h-12 rounded-full px-8 text-white font-medium",
        "bg-[#e13429] hover:bg-[#c62d23] transition shadow-md",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  const OutlineButton = ({ children, className = "" }) => (
    <button
      className={[
        "h-12 rounded-full px-6 font-medium",
        "border border-[#e13429] text-[#e13429] hover:bg-red-50 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full min-h-screen bg-[#f8fafc]">
      {/* BANNER */}
      <div className="relative w-full h-[360px] overflow-hidden">
        <img
          src={event.bannerImageUrl}
          className="w-full h-full object-cover"
          alt="Event Banner"
        />

        {/* Premium overlay (dark + slight red tint) */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/70" />
        <div className="absolute -top-24 -right-28 w-80 h-80 rounded-full blur-3xl bg-[#e13429]/25" />

        {/* Banner content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <div className="max-w-6xl">
            <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight">
              {event.name}
            </h1>
            <p className="text-white/90 text-base sm:text-lg max-w-3xl mt-3">
              {event.caption}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Pill>{event.month || "Month"}</Pill>

              {hasVolunteerCredit && (
                <Pill>
                  Volunteer Credit: {event.volunteerHours?.isAvailable ? "Yes" : "No"}
                </Pill>
              )}

              {hasEstimatedTime && <Pill>Time: {event.estimatedTime.text}</Pill>}
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/home/event/${eventId}/step/1`}
          state={{ event }}
          className="absolute bottom-6 right-6"
        >
          <PrimaryButton>Get Started →</PrimaryButton>
        </Link>
      </div>

      {/* INFO ROW */}
      <div className="px-4 sm:px-10 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <p className="text-xs font-bold text-[#e13429]">MONTH</p>
            <p className="font-semibold text-gray-900 mt-1">{event.month}</p>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold text-[#e13429]">STARTS AT</p>
            <p className="font-semibold text-gray-900 mt-1">
              {startDate || "Not specified"}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold text-[#e13429]">ENDS AT</p>
            <p className="font-semibold text-gray-900 mt-1">
              {endDate || "Not specified"}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold text-[#e13429]">VOLUNTEER CREDIT</p>
            <p className="font-semibold text-gray-900 mt-1">
              {hasVolunteerCredit
                ? event.volunteerHours.isAvailable
                  ? "YES"
                  : "NO"
                : "Not specified"}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold text-[#e13429]">ESTIMATED TIME</p>
            <p className="font-semibold text-gray-900 mt-1">
              {hasEstimatedTime ? event.estimatedTime.text : "Not specified"}
            </p>
          </Card>
        </div>
      </div>

      {/* CONTENT + ACTION STEPS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-10 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-8">
          <Card className="p-6 sm:p-8">
            {/* Short description */}
            {event.shortDescription && (
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {event.shortDescription}
              </p>
            )}

            {/* Long description */}
            {event.longDescription && (
              <div className="mt-6 space-y-4">
                {event.longDescription
                  .split("\n")
                  .filter((line) => line.trim().length > 0)
                  .map((para, idx) => (
                    <p key={idx} className="text-sm sm:text-base leading-relaxed text-gray-600">
                      {para}
                    </p>
                  ))}
              </div>
            )}

            {/* Highlight Banner */}
            {event.highlightText && (
              <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6 sm:p-8 text-center">
                <p className="text-lg sm:text-2xl font-semibold italic text-gray-900">
                  {event.highlightText}
                </p>
              </div>
            )}

            {/* Requirements */}
            {event.requirements?.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-extrabold mb-4 text-gray-900">
                  Requirements
                </h2>
                <ul className="space-y-4">
                  {event.requirements.map((req) => (
                    <li
                      key={req._id}
                      className="border border-gray-200 rounded-3xl p-4 bg-[#f8fafc]"
                    >
                      <p className="font-semibold text-gray-900">{req.title}</p>
                      {req.description && (
                        <p className="text-gray-600 mt-1">{req.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* FAQs */}
            {event.FAQs?.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-extrabold mb-4 text-gray-900">
                  Volunteer Credit FAQs
                </h2>
                <div className="space-y-4">
                  {event.FAQs.map((faq) => (
                    <div
                      key={faq._id}
                      className="border border-gray-200 rounded-3xl p-4 bg-[#f8fafc]"
                    >
                      <p className="font-semibold text-gray-900">
                        Q: {faq.question}
                      </p>
                      <p className="text-gray-600 mt-1">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </Card>
        </div>

        {/* RIGHT STICKY ACTION STEPS */}
        <div className="lg:col-span-4">
          <div className="sticky top-20">
            <Card className="p-6">
              <h3 className="text-xl font-extrabold mb-5 text-gray-900">
                Action Steps
              </h3>

              {event.actionSteps?.length > 0 ? (
                <div className="flex flex-col space-y-4">
                  {event.actionSteps.map((step) => {
                    const isDone = step.isCompleted === true;

                    return (
                      <div
                        key={step._id || step.stepNumber}
                        className="flex items-start gap-3"
                      >
                        {/* Circle */}
                        <div
                          className={[
                            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border",
                            isDone
                              ? "bg-[#e13429] text-white border-[#e13429]"
                              : "border-gray-300 text-gray-800 bg-white",
                          ].join(" ")}
                        >
                          {isDone ? "✓" : step.stepNumber}
                        </div>

                        {/* Clickable Title */}
                        <div className="flex-1">
                          <Link to={getActionLink(step)} className="no-underline">
                            <p className="font-bold uppercase tracking-wide text-gray-900 hover:text-[#e13429] transition">
                              {step.title}
                            </p>
                          </Link>

                          {step.isRequired && (
                            <span className="mt-1 inline-flex items-center rounded-full border border-[#e13429] bg-red-50 px-2 py-0.5 text-xs font-medium text-[#e13429]">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No action steps added.</p>
              )}

              <div className="mt-6">
                <Link to={`/home/event/${eventId}/step/1`} state={{ event }}>
                  <OutlineButton className="w-full">Start Step 1 →</OutlineButton>
                </Link>
              </div>
            </Card>

            {/* Small helper card */}
            <Card className="mt-4 p-5">
              <p className="text-sm text-gray-600">
                Tip: Complete the steps in order to maximize impact and earn credit (if available).
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;