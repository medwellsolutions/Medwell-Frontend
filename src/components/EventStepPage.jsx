import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/S3Upload"; // IMPORTANT: this path is case-sensitive on Linux
import { useSelector } from "react-redux";

const EventStepPage = () => {
  const { eventId, stepNumber } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user?.data);

  const eventFromState = location.state?.event || null;

  const [event, setEvent] = useState(eventFromState);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!eventFromState);

  const [proofFile, setProofFile] = useState(null);
  const [socialLink, setSocialLink] = useState("");
  const [experience, setExperience] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const currentStepNum = Number(stepNumber) || 1;

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    if (!user) return;
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
  }, [eventId, eventFromState, user]);

  if (!user) return null;

  // UI helpers (local, so you can copy-paste file-by-file)
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white border border-gray-200 rounded-3xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  const PrimaryButton = ({ children, className = "", disabled, ...rest }) => (
    <button
      {...rest}
      disabled={disabled}
      className={[
        "h-12 rounded-full px-8 text-white font-medium",
        "bg-[#e13429] hover:bg-[#c62d23] transition shadow-md",
        disabled ? "opacity-60 cursor-not-allowed hover:bg-[#e13429]" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  const OutlineButton = ({ children, className = "", ...rest }) => (
    <button
      {...rest}
      className={[
        "h-12 rounded-full px-6 font-medium",
        "border border-[#e13429] text-[#e13429] hover:bg-red-50 transition",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );

  const Input = (props) => (
    <input
      {...props}
      className={[
        "w-full border border-gray-200 rounded-xl px-4 h-11 bg-white",
        "focus:outline-none focus:ring-2 focus:ring-[#e13429]/30",
        props.className || "",
      ].join(" ")}
    />
  );

  const TextArea = (props) => (
    <textarea
      {...props}
      className={[
        "w-full border border-gray-200 rounded-xl px-4 py-3 bg-white",
        "focus:outline-none focus:ring-2 focus:ring-[#e13429]/30",
        props.className || "",
      ].join(" ")}
    />
  );

  const FilePicker = ({ onChange }) => (
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] grid place-items-center px-4">
        <div className="text-center">
          <div className="h-10 w-10 rounded-full border-4 border-gray-200 border-t-[#e13429] animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading step...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] grid place-items-center px-4">
        <div className="max-w-xl w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!event) return null;

  const steps = event.actionSteps || [];

  const currentStep =
    steps.find((s) => s.stepNumber === currentStepNum) || steps[0] || null;

  const lastStepNumber =
    steps.length > 0 ? Math.max(...steps.map((s) => s.stepNumber)) : 1;

  const hasNext = currentStep && currentStep.stepNumber < lastStepNumber;
  const isFinalStep = currentStep && currentStep.stepNumber === lastStepNumber;

  const handleProofUpload = async () => {
    if (!proofFile && !socialLink.trim()) {
      alert("Please upload a photo or provide a social media link as proof.");
      return;
    }

    if (!experience.trim()) {
      alert("Please share your experience to complete this step.");
      return;
    }

    try {
      setSubmitting(true);

      let proofImageUrl = "";
      if (proofFile) {
        proofImageUrl = await uploadFileToS3(proofFile, setUploadProgress);
      }

      const payload = {
        event: eventId,
        stepNumber: currentStep.stepNumber,
        proofImageUrl: proofImageUrl || undefined,
        socialLink: socialLink.trim() || undefined,
        experience: experience.trim(),
      };

      const { data } = await axios.post(`${BASE_URL}/activity/submission`, payload, {
        withCredentials: true,
      });

      console.log("Submission response:", data);
      alert("Thank you! Your submission has been sent for review.");

      setProofFile(null);
      setSocialLink("");
      setExperience("");
      setUploadProgress(0);
    } catch (err) {
      console.error("Error while submitting proof:", err);
      const msg =
        err.response?.data?.message || "Failed to submit. Please try again.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc]">
      {/* BANNER */}
      <div className="relative w-full h-[260px] overflow-hidden">
        <img
          src={event.bannerImageUrl}
          className="w-full h-full object-cover"
          alt="Event Banner"
        />

        {/* Premium overlay */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/70" />
        <div className="absolute -top-24 -right-28 w-80 h-80 rounded-full blur-3xl bg-[#e13429]/25" />

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <p className="text-sm text-white/80 uppercase tracking-[0.2em] mb-1">
            Step {currentStep?.stepNumber || 1}
          </p>
          <h1 className="text-white text-3xl md:text-4xl font-extrabold max-w-4xl">
            {currentStep ? currentStep.title : event.name}
          </h1>
          <p className="text-white/90 mt-3 max-w-4xl">{event.name}</p>
        </div>
      </div>

      {/* MINI INFO ROW */}
      <div className="px-4 sm:px-10 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-xs font-bold text-[#e13429]">MONTH</p>
            <p className="font-semibold text-gray-900 mt-1">{event.month || "—"}</p>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold text-[#e13429]">VOLUNTEER CREDIT</p>
            <p className="font-semibold text-gray-900 mt-1">
              {event.volunteerHours?.isAvailable ? "YES" : "NO"}
            </p>
          </Card>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-10 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: ACTION STEPS CHECKLIST */}
        <aside className="lg:col-span-4">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-extrabold mb-5 text-gray-900">Action Steps</h2>

            {steps.length === 0 ? (
              <p className="text-gray-600 text-sm">No steps added yet.</p>
            ) : (
              <div className="flex flex-col space-y-4">
                {steps.map((step, idx) => {
                  const isCurrent = step.stepNumber === currentStepNum;
                  const isDone = step.isCompleted === true;
                  const isLast = idx === steps.length - 1;

                  return (
                    <div key={step._id || step.stepNumber} className="flex">
                      {/* icon + line */}
                      <div className="flex flex-col items-center mr-3">
                        <div
                          className={[
                            "w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold",
                            isDone
                              ? "bg-[#e13429] text-white border-[#e13429]"
                              : isCurrent
                              ? "border-[#e13429] text-[#e13429] bg-white"
                              : "border-gray-300 text-gray-800 bg-white",
                          ].join(" ")}
                        >
                          {isDone ? "✓" : step.stepNumber}
                        </div>

                        {!isLast && (
                          <div className="w-px flex-1 border-l border-dashed border-gray-200 mt-1"></div>
                        )}
                      </div>

                      {/* label */}
                      <div className="flex-1">
                        <Link
                          to={`/home/event/${eventId}/step/${step.stepNumber}`}
                          state={{ event }}
                        >
                          <p
                            className={[
                              "font-semibold text-sm tracking-wide",
                              isCurrent ? "text-[#e13429]" : "text-gray-900",
                            ].join(" ")}
                          >
                            {step.title.toUpperCase()}
                          </p>
                        </Link>

                        {step.isRequired && (
                          <p className="text-[11px] mt-1 text-[#e13429]">
                            * Required
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* quick nav */}
            <div className="mt-6 flex gap-2">
              <Link to={`/home/event/${eventId}`} state={{ event }} className="flex-1">
                <OutlineButton className="w-full">Event Page</OutlineButton>
              </Link>

              <Link to={`/home/event/${eventId}/step/1`} state={{ event }} className="flex-1">
                <PrimaryButton className="w-full">Step 1</PrimaryButton>
              </Link>
            </div>
          </Card>
        </aside>

        {/* RIGHT: CURRENT STEP CONTENT */}
        <main className="lg:col-span-8">
          {currentStep ? (
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Step {currentStep.stepNumber}: {currentStep.title}
              </h2>

              <div className="mt-6 space-y-6">
                {(currentStep.contentBlocks || []).map((block, idx) => (
                  <section key={idx} className="space-y-2">
                    {block.heading && (
                      <h3 className="text-lg font-bold text-[#e13429]">
                        {block.heading}
                      </h3>
                    )}

                    {block.text && (
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
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
                              className="text-[#e13429] underline font-semibold hover:text-[#c62d23] transition"
                            >
                              {lnk.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {/* FINAL STEP */}
              {isFinalStep && (
                <div className="mt-10 bg-[#f8fafc] border border-gray-200 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Upload Proof & Complete This Step
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    Follow the instructions above for what counts as proof for this
                    activity. You can complete this step by uploading a photo/screenshot,
                    sharing a social media post link, or both. Sharing your experience is
                    required so we can understand the impact of your actions.
                  </p>

                  {/* Upload */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Upload photo or screenshot
                    </p>
                    <FilePicker onChange={(e) => setProofFile(e.target.files?.[0] || null)} />
                  </div>

                  {proofFile && (
                    <div className="mt-2">
                      <p className="font-semibold text-sm text-gray-900 mb-2">
                        Preview
                      </p>
                      <img
                        src={URL.createObjectURL(proofFile)}
                        alt="Proof Preview"
                        className="w-60 h-60 object-cover rounded-2xl border border-gray-200 shadow"
                      />
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <p className="text-gray-600 text-sm mb-2">
                        Uploading: {uploadProgress}%
                      </p>
                      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-[#e13429]"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Social link */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Link to your social media post
                    </p>
                    <Input
                      type="url"
                      value={socialLink}
                      onChange={(e) => setSocialLink(e.target.value)}
                      placeholder="https://www.instagram.com/..., https://x.com/..., etc."
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Instagram, Facebook, X, Reddit, or any platform used in this activity.
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Tell us about your experience (required)
                    </p>
                    <TextArea
                      rows={4}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="How did this activity feel? What did you learn or share?"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Write a few lines so we can understand your contribution.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <PrimaryButton
                      type="button"
                      onClick={handleProofUpload}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit & Complete Event"}
                    </PrimaryButton>
                  </div>
                </div>
              )}

              {/* NEXT STEP BUTTON */}
              {hasNext && (
                <div className="mt-8 flex justify-end">
                  <Link
                    to={`/home/event/${eventId}/step/${currentStep.stepNumber + 1}`}
                    state={{ event }}
                  >
                    <OutlineButton className="px-8">Next Step →</OutlineButton>
                  </Link>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-gray-600">No content found for this step.</p>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default EventStepPage;