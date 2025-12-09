import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const EventStepPage = () => {
  const { eventId, stepNumber } = useParams();
  const location = useLocation();

  // Try to read event from router state first
  const eventFromState = location.state?.event || null;

  const [event, setEvent] = useState(eventFromState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!eventFromState);

  // Final-step local state (generic proof section)
  const [proofFile, setProofFile] = useState(null);
  const [socialLink, setSocialLink] = useState("");
  const [experience, setExperience] = useState("");

  const currentStepNum = Number(stepNumber) || 1;

  useEffect(() => {
    // If we already have the event from state, no need to fetch
    if (eventFromState) return;

    const loadEvent = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/event/${eventId}`, {
          withCredentials: true,
        });
        setEvent(data.event);
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, eventFromState]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!event) return null;

  const steps = event.actionSteps || [];

  const currentStep =
    steps.find((s) => s.stepNumber === currentStepNum) || steps[0] || null;

  // Find last step number (so Next hides on last one)
  const lastStepNumber =
    steps.length > 0 ? Math.max(...steps.map((s) => s.stepNumber)) : 1;

  const hasNext =
    currentStep && currentStep.stepNumber < lastStepNumber;

  const isFinalStep =
    currentStep && currentStep.stepNumber === lastStepNumber;

  // Generic proof handler: require at least photo OR link, AND experience
  const handleProofUpload = async () => {
    if (!proofFile && !socialLink.trim()) {
      alert("Please upload a photo or provide a social media link as proof.");
      return;
    }

    if (!experience.trim()) {
      alert("Please share your experience to complete this step.");
      return;
    }

    console.log("Proof file:", proofFile);
    console.log("Social link:", socialLink);
    console.log("Experience text:", experience);

    alert(
      "Thank you! Proof and experience will be wired to the backend in the next phase."
    );

    // Later:
    // 1. Upload proofFile (if present) to S3
    // 2. POST { eventId, stepNumber, proofUrl, socialLink, experience } to backend
    // 3. Mark this step/event completed and award hours/certificates
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* BANNER */}
      <div className="relative w-full h-[260px] overflow-hidden">
        <img
          src={event.bannerImageUrl}
          className="w-full h-full object-cover"
          alt="Event Banner"
        />

        <div className="absolute inset-0 bg-black/45 flex flex-col justify-center px-10">
          <p className="text-sm text-gray-200 uppercase tracking-[0.2em] mb-1">
            Step {currentStep?.stepNumber || 1}
          </p>
          <h1 className="text-white text-3xl md:text-4xl font-bold max-w-3xl">
            {currentStep ? currentStep.title : event.name}
          </h1>
          <p className="text-white/90 mt-3 max-w-3xl">{event.name}</p>
        </div>
      </div>

      {/* MINI INFO ROW */}
      <div className="flex flex-wrap items-start gap-10 px-10 py-5 border-b">
        <div>
          <p className="text-xs font-semibold text-neutral-500">MONTH:</p>
          <p className="font-bold text-sm">{event.month}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-500">
            VOLUNTEER CREDIT:
          </p>
          <p className="font-bold text-sm">
            {event.volunteerHours?.isAvailable ? "YES" : "NO"}
          </p>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row w-full px-10 py-10 gap-10">
        {/* LEFT: ACTION STEPS CHECKLIST */}
        <aside className="w-full lg:w-[30%]">
          <div className="bg-black text-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-5">Action Steps</h2>

            {steps.length === 0 ? (
              <p className="text-sm opacity-80">No steps added yet.</p>
            ) : (
              <div className="flex flex-col space-y-5">
                {steps.map((step, idx) => {
                  const isCurrent = step.stepNumber === currentStepNum;
                  const isDone = step.isCompleted === true;
                  const isLast = idx === steps.length - 1;

                  return (
                    <div key={step._id || step.stepNumber} className="flex">
                      {/* icon + line */}
                      <div className="flex flex-col items-center mr-3">
                        <div
                          className={
                            "w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold " +
                            (isDone
                              ? "bg-green-500 border-green-500 text-black"
                              : isCurrent
                              ? "border-white text-white"
                              : "border-green-500 text-green-500")
                          }
                        >
                          {isDone ? "✓" : step.stepNumber}
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 border-l-2 border-dashed border-green-500 mt-1"></div>
                        )}
                      </div>

                      {/* label */}
                      <div className="flex-1">
                        <Link
                          to={`/home/event/${eventId}/step/${step.stepNumber}`}
                          state={{ event }} // keep passing event
                        >
                          <p
                            className={
                              "font-semibold text-sm tracking-wide " +
                              (isCurrent ? "text-white" : "text-gray-200")
                            }
                          >
                            {step.title.toUpperCase()}
                          </p>
                        </Link>
                        {step.isRequired && (
                          <p className="text-[11px] text-red-300 mt-0.5">
                            * Required
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: CURRENT STEP CONTENT */}
        <main className="w-full lg:w-[70%]">
          {currentStep ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">
                Step {currentStep.stepNumber}: {currentStep.title}
              </h2>

              {(currentStep.contentBlocks || []).map((block, idx) => (
                <section key={idx} className="space-y-2">
                  {block.heading && (
                    <h3 className="text-lg font-semibold">{block.heading}</h3>
                  )}
                  {block.text && (
                    <p className="text-[16px] leading-relaxed text-gray-800">
                      {block.text}
                    </p>
                  )}

                  {block.links && block.links.length > 0 && (
                    <ul className="list-disc pl-6 space-y-1">
                      {block.links.map((lnk, i) => (
                        <li key={i}>
                          <a
                            href={lnk.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 underline font-medium"
                          >
                            {lnk.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* FINAL STEP: Generic Upload Proof + Experience */}
              {isFinalStep && (
                <div className="mt-10 p-6 border rounded-xl bg-gray-50 shadow-sm space-y-4">
                  <h3 className="text-xl font-semibold">
                    Upload Proof & Complete This Step
                  </h3>

                  <p className="text-sm text-gray-600">
                    Follow the instructions above for what counts as proof for
                    this activity. You can complete this step by uploading a
                    photo/screenshot, sharing a social media post link, or both.
                    Sharing your experience is required so we can understand the
                    impact of your actions.
                  </p>

                  {/* File Input */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Upload photo or screenshot
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files[0])}
                      className="block text-sm"
                    />
                  </div>

                  {/* Preview */}
                  {proofFile && (
                    <div className="my-4">
                      <p className="font-medium mb-2 text-sm">Preview:</p>
                      <img
                        src={URL.createObjectURL(proofFile)}
                        alt="Proof Preview"
                        className="w-60 h-60 object-cover rounded-md border shadow"
                      />
                    </div>
                  )}

                  {/* Social link (optional) */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Link to your social media post
                    </label>
                    <input
                      type="url"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      placeholder="https://www.instagram.com/..., https://x.com/..., etc."
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      For example: Instagram, Facebook, X, Reddit, or any other
                      platform used in this activity.
                    </p>
                  </div>

                  {/* Experience Text (REQUIRED) */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tell us about your experience (required)
                    </label>
                    <textarea
                      rows={4}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="How did this activity feel? What did you learn or share? Anything you want others to know?"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/70"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Please write a few lines so we can better understand your
                      contribution and learning.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleProofUpload}
                      className="bg-black text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition"
                    >
                      Submit & Complete Event
                    </button>
                  </div>
                </div>
              )}

              {/* NEXT STEP BUTTON (hidden on last step) */}
              {hasNext && (
                <div className="mt-8 flex justify-end">
                  <Link
                    to={`/home/event/${eventId}/step/${
                      currentStep.stepNumber + 1
                    }`}
                    state={{ event }}
                  >
                    <button className="bg-black text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition">
                      Next Step →
                    </button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p>No content found for this step.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventStepPage;
