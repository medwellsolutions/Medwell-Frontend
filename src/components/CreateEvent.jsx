import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/s3Upload";

const toDatetimeLocal = (iso) => {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
};

const emptyForm = {
  name: "",
  caption: "",
  month: "",
  startsAt: "",
  endsAt: "",
  shortDescription: "",
  longDescription: "",
  actionSteps: [],
  estimatedTime: { text: "", minHours: "", maxHours: "" },
  volunteerHours: { isAvailable: true, hours: "" },
  additionalInstructions: [],
  certificateInfo: {
    includesName: true,
    includesDate: true,
    includesEventName: true,
    includesHours: true,
    templateUrl: "",
  },
  requirements: [],
  checkListItems: [],
  FAQs: [],
  isActive: true,
};

const CreateEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(eventId);

  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingBannerUrl, setExistingBannerUrl] = useState("");

  const [formData, setFormData] = useState(emptyForm);
  const [fetchLoading, setFetchLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    axios
      .get(`${BASE_URL}/event/${eventId}`, { withCredentials: true })
      .then(({ data }) => {
        const ev = data.event;
        setExistingImageUrl(ev.imageUrl || "");
        setExistingBannerUrl(ev.bannerImageUrl || "");
        setFormData({
          name: ev.name || "",
          caption: ev.caption || "",
          month: ev.month || "",
          startsAt: toDatetimeLocal(ev.startsAt),
          endsAt: toDatetimeLocal(ev.endsAt),
          shortDescription: ev.shortDescription || "",
          longDescription: ev.longDescription || "",
          actionSteps: ev.actionSteps || [],
          estimatedTime: ev.estimatedTime || { text: "", minHours: "", maxHours: "" },
          volunteerHours: ev.volunteerHours || { isAvailable: true, hours: "" },
          additionalInstructions: ev.additionalInstructions || [],
          certificateInfo: ev.certificateInfo || emptyForm.certificateInfo,
          requirements: ev.requirements || [],
          checkListItems: ev.checkListItems || [],
          FAQs: ev.FAQs || [],
          isActive: ev.isActive ?? true,
        });
      })
      .catch((err) => {
        console.error("Failed to load event for editing:", err);
        alert("Could not load event data.");
      })
      .finally(() => setFetchLoading(false));
  }, [eventId, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = (field, item) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = existingImageUrl;
      if (imageFile) imageUrl = await uploadFileToS3(imageFile);

      let bannerImageUrl = existingBannerUrl;
      if (bannerFile) bannerImageUrl = await uploadFileToS3(bannerFile);

      const payload = { ...formData, imageUrl, bannerImageUrl };

      if (isEditing) {
        await axios.patch(`${BASE_URL}/admin/event/${eventId}`, payload, {
          withCredentials: true,
        });
        alert("Event updated successfully!");
        navigate(`/home/event/${eventId}`);
      } else {
        await axios.post(`${BASE_URL}/admin/createevent`, payload, {
          withCredentials: true,
        });
        alert("Event created successfully!");
      }
    } catch (err) {
      console.error("Error submitting event:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Something went wrong."
      );
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-[40vh] bg-[#f8fafc] grid place-items-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-[#e13429] animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading event…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {isEditing
              ? "Update the fields below and save your changes."
              : "Fill the basics first, then add steps, checklist, requirements and FAQs."}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Name" className="sm:col-span-2">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  placeholder="e.g., Women's History Month: Honoring Women in Health"
                />
              </Field>

              <Field label="Caption" className="sm:col-span-2">
                <input
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  placeholder="e.g., Celebrate the women who shaped healthcare."
                />
              </Field>

              <Field label="Month" className="sm:col-span-2">
                <input
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  placeholder="YYYY-MM format — e.g., 2026-03 for March 2026"
                />
                <p className="text-xs text-gray-500 mt-1">Must be in YYYY-MM format (e.g., 2026-03)</p>
              </Field>
            </div>

            {/* IMAGES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Event Thumbnail">
                {existingImageUrl && (
                  <img
                    src={existingImageUrl}
                    alt="Current thumbnail"
                    className="w-full h-32 object-cover rounded-xl mb-2 border border-gray-200"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {isEditing ? "Upload a new file to replace the current thumbnail." : "Used on campaign cards."}
                </p>
              </Field>

              <Field label="Event Banner">
                {existingBannerUrl && (
                  <img
                    src={existingBannerUrl}
                    alt="Current banner"
                    className="w-full h-32 object-cover rounded-xl mb-2 border border-gray-200"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {isEditing ? "Upload a new file to replace the current banner." : "Used on event detail page."}
                </p>
              </Field>
            </div>

            {/* DATE FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Starts At">
                <input
                  type="datetime-local"
                  name="startsAt"
                  value={formData.startsAt}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                />
              </Field>

              <Field label="Ends At">
                <input
                  type="datetime-local"
                  name="endsAt"
                  value={formData.endsAt}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                />
              </Field>
            </div>

            {/* DESCRIPTIONS */}
            <div className="grid grid-cols-1 gap-5">
              <Field label="Short Description">
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  rows={3}
                  placeholder="2–3 sentences shown on the event card."
                />
              </Field>

              <Field label="Long Description">
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  rows={5}
                  placeholder="Full detail shown on the event page."
                />
              </Field>
            </div>

            {/* ACTION STEPS */}
            <ActionSteps
              items={formData.actionSteps}
              addItem={(step) => addItem("actionSteps", step)}
              removeItem={(i) => removeItem("actionSteps", i)}
            />

            {/* CHECKLIST */}
            <ChecklistItems
              items={formData.checkListItems}
              addItem={(chk) => addItem("checkListItems", chk)}
              removeItem={(i) => removeItem("checkListItems", i)}
            />

            {/* REQUIREMENTS */}
            <Requirements
              items={formData.requirements}
              addItem={(req) => addItem("requirements", req)}
              removeItem={(i) => removeItem("requirements", i)}
            />

            {/* FAQ */}
            <FAQs
              items={formData.FAQs}
              addItem={(faq) => addItem("FAQs", faq)}
              removeItem={(i) => removeItem("FAQs", i)}
            />

            {/* SUBMIT */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:justify-end">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => navigate(`/home/event/${eventId}`)}
                  className="h-12 rounded-full px-8 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="h-12 rounded-full px-8 text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-md"
              >
                {isEditing ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    {children}
  </label>
);

const SectionCard = ({ title, desc, children }) => (
  <div className="mt-6 bg-white border border-gray-200 rounded-3xl shadow-sm p-5">
    <div className="mb-3">
      <h2 className="font-semibold text-lg text-gray-900">{title}</h2>
      {desc ? <p className="text-gray-600 text-sm mt-1">{desc}</p> : null}
    </div>
    {children}
  </div>
);

const RemoveBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="ml-2 h-6 w-6 rounded-full border border-red-200 bg-red-50 text-[#e13429] text-xs hover:bg-red-100 transition inline-flex items-center justify-center shrink-0"
    title="Remove"
  >
    ✕
  </button>
);

// =========================================
// SUB COMPONENTS
// =========================================

const ActionSteps = ({ items, addItem, removeItem }) => {
  const [step, setStep] = useState({
    stepNumber: "",
    title: "",
    isRequired: false,
    contentBlocks: [],
  });

  const [block, setBlock] = useState({ heading: "", text: "", links: [] });
  const [link, setLink] = useState({ label: "", url: "" });

  const handleAddLinkToBlock = () => {
    if (!link.label.trim() || !link.url.trim()) return;
    setBlock((prev) => ({ ...prev, links: [...prev.links, link] }));
    setLink({ label: "", url: "" });
  };

  const handleAddBlockToStep = () => {
    if (!block.heading.trim() && !block.text.trim()) return;
    setStep((prev) => ({ ...prev, contentBlocks: [...prev.contentBlocks, block] }));
    setBlock({ heading: "", text: "", links: [] });
    setLink({ label: "", url: "" });
  };

  const handleAddStep = () => {
    if (!step.stepNumber || !step.title.trim() || step.contentBlocks.length === 0) return;
    addItem({
      stepNumber: Number(step.stepNumber),
      title: step.title.trim(),
      isRequired: step.isRequired,
      isCompleted: false,
      contentBlocks: step.contentBlocks,
    });
    setStep({ stepNumber: "", title: "", isRequired: false, contentBlocks: [] });
    setBlock({ heading: "", text: "", links: [] });
    setLink({ label: "", url: "" });
  };

  return (
    <SectionCard
      title="Action Steps"
      desc="Build the steps users need to complete. Each step must have at least one content block."
    >
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-4 bg-[#f8fafc]">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-gray-900">
                  Step {s.stepNumber}: {s.title}{" "}
                  {s.isRequired && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-medium text-[#e13429]">
                      Required
                    </span>
                  )}
                </div>
                <RemoveBtn onClick={() => removeItem(i)} />
              </div>
              {s.contentBlocks?.map((b, idx) => (
                <div key={idx} className="mt-2 ml-2 text-sm">
                  {b.heading && <p className="font-semibold text-gray-900">{b.heading}</p>}
                  {b.text && <p className="text-gray-600">{b.text}</p>}
                  {b.links?.length > 0 && (
                    <ul className="list-disc ml-5 mt-1">
                      {b.links.map((lnk, j) => (
                        <li key={j} className="text-gray-600">
                          {lnk.label}{" "}
                          <a className="text-[#e13429] underline" href={lnk.url} target="_blank" rel="noreferrer">
                            {lnk.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No action steps added yet.</p>
      )}

      <div className="mt-5 border-t border-gray-200 pt-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="e.g., 1"
            type="number"
            className="w-full sm:w-40 border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
            value={step.stepNumber}
            onChange={(e) => setStep({ ...step, stepNumber: e.target.value })}
          />
          <input
            placeholder="e.g., Learn & Research"
            className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
            value={step.title}
            onChange={(e) => setStep({ ...step, title: e.target.value })}
          />
        </div>

        <label className="flex gap-2 items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#e13429]"
            checked={step.isRequired}
            onChange={(e) => setStep({ ...step, isRequired: e.target.checked })}
          />
          <span>Required step</span>
        </label>

        <div className="p-4 border border-gray-200 rounded-3xl bg-[#f8fafc] space-y-3">
          <p className="font-semibold text-sm text-gray-900">Add Content Block</p>
          <input
            placeholder="Section heading (optional)"
            className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
            value={block.heading}
            onChange={(e) => setBlock({ ...block, heading: e.target.value })}
          />
          <textarea
            placeholder="Paragraph text…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
            rows={3}
            value={block.text}
            onChange={(e) => setBlock({ ...block, text: e.target.value })}
          />
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                placeholder="Link label"
                className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                value={link.label}
                onChange={(e) => setLink({ ...link, label: e.target.value })}
              />
              <input
                placeholder="https://..."
                className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                value={link.url}
                onChange={(e) => setLink({ ...link, url: e.target.value })}
              />
              <button
                type="button"
                className="h-11 rounded-full px-5 text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm"
                onClick={handleAddLinkToBlock}
              >
                Add Link
              </button>
            </div>
            {block.links.length > 0 && (
              <ul className="list-disc ml-5 text-sm">
                {block.links.map((lnk, i) => (
                  <li key={i} className="text-gray-600">
                    {lnk.label} —{" "}
                    <a className="text-[#e13429] underline" href={lnk.url} target="_blank" rel="noreferrer">
                      {lnk.url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="h-11 rounded-full px-5 border border-[#e13429] text-[#e13429] hover:bg-red-50 transition"
            onClick={handleAddBlockToStep}
          >
            Add Content Block to Step
          </button>
        </div>

        {step.contentBlocks.length > 0 && (
          <div className="text-sm">
            <p className="font-semibold text-gray-900 mb-1">Content blocks for this step:</p>
            {step.contentBlocks.map((b, idx) => (
              <p key={idx} className="ml-3 text-gray-600">• {b.heading || "Untitled section"}</p>
            ))}
          </div>
        )}

        <button
          type="button"
          className="h-11 rounded-full px-6 text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm"
          onClick={handleAddStep}
        >
          Add Action Step
        </button>
      </div>
    </SectionCard>
  );
};

const ChecklistItems = ({ items, addItem, removeItem }) => {
  const [chk, setChk] = useState({ text: "", isMandatory: false });

  return (
    <SectionCard title="Checklist Items" desc="Checklist shown to the user for completion.">
      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map((c, i) => (
            <div key={i} className="flex items-center gap-1 text-sm text-gray-800">
              <span>✔ {c.text}</span>
              {c.isMandatory && (
                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-medium text-[#e13429]">
                  Mandatory
                </span>
              )}
              <RemoveBtn onClick={() => removeItem(i)} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No checklist items added yet.</p>
      )}

      <div className="space-y-3 mt-4">
        <input
          placeholder="e.g., Researched and wrote a summary of a health leader"
          className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
          value={chk.text}
          onChange={(e) => setChk({ ...chk, text: e.target.value })}
        />
        <label className="flex gap-2 items-center text-sm text-gray-700">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#e13429]"
            checked={chk.isMandatory}
            onChange={(e) => setChk({ ...chk, isMandatory: e.target.checked })}
          />
          <span>Mandatory</span>
        </label>
        <button
          type="button"
          className="h-11 rounded-full px-6 text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm"
          onClick={() => {
            if (!chk.text.trim()) return;
            addItem(chk);
            setChk({ text: "", isMandatory: false });
          }}
        >
          Add Checklist
        </button>
      </div>
    </SectionCard>
  );
};

const Requirements = ({ items, addItem, removeItem }) => {
  const [req, setReq] = useState({ title: "", description: "" });

  return (
    <SectionCard title="Requirements" desc="What a user must have/do to participate.">
      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map((r, i) => (
            <div key={i} className="flex items-center gap-1 text-sm text-gray-800">
              <span>• {r.title}</span>
              <RemoveBtn onClick={() => removeItem(i)} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No requirements added yet.</p>
      )}

      <div className="space-y-3 mt-4">
        <input
          placeholder="e.g., Active Medwell Account"
          className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
          value={req.title}
          onChange={(e) => setReq({ ...req, title: e.target.value })}
        />
        <textarea
          placeholder="e.g., You must have a verified and active Medwell account."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
          rows={3}
          value={req.description}
          onChange={(e) => setReq({ ...req, description: e.target.value })}
        />
        <button
          type="button"
          className="h-11 rounded-full px-6 text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm"
          onClick={() => {
            if (!req.title.trim()) return;
            addItem(req);
            setReq({ title: "", description: "" });
          }}
        >
          Add Requirement
        </button>
      </div>
    </SectionCard>
  );
};

const FAQs = ({ items, addItem, removeItem }) => {
  const [faq, setFaq] = useState({ question: "", answer: "" });

  return (
    <SectionCard title="FAQs" desc="Frequently asked questions shown on event details.">
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((f, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-4 bg-[#f8fafc]">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-gray-800"><b>Q:</b> {f.question}</p>
                  <p className="text-sm text-gray-600 mt-1"><b>A:</b> {f.answer}</p>
                </div>
                <RemoveBtn onClick={() => removeItem(i)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">No FAQs added yet.</p>
      )}

      <div className="space-y-3 mt-4">
        <input
          placeholder="e.g., Can I choose a woman from any country or era?"
          className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        />
        <textarea
          placeholder="e.g., Yes! Any country or time period."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
          rows={3}
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        />
        <button
          type="button"
          className="h-11 rounded-full px-6 text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm"
          onClick={() => {
            if (!faq.question.trim() || !faq.answer.trim()) return;
            addItem(faq);
            setFaq({ question: "", answer: "" });
          }}
        >
          Add FAQ
        </button>
      </div>
    </SectionCard>
  );
};

export default CreateEvent;
