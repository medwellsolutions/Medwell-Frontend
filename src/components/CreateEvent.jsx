import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/s3Upload";

const CreateEvent = () => {
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const [formData, setFormData] = useState({
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
  });

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Push to arrays
  const addItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  // MAIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CreateEvent submit called", {
      imageFile,
      bannerFile,
      formData,
    });

    try {
      // 1. Upload thumbnail image
      let imageUrl = "";
      if (imageFile) {
        console.log("Uploading THUMBNAIL to S3...");
        imageUrl = await uploadFileToS3(imageFile);
        console.log("Thumbnail uploaded. URL:", imageUrl);
      } else {
        console.warn("No thumbnail image selected");
      }

      // 2. Upload banner image
      let bannerImageUrl = "";
      if (bannerFile) {
        console.log("Uploading BANNER to S3...");
        bannerImageUrl = await uploadFileToS3(bannerFile);
        console.log("Banner uploaded. URL:", bannerImageUrl);
      } else {
        console.warn("No banner image selected");
      }

      // 3. Build final payload
      const payload = {
        ...formData,
        imageUrl,
        bannerImageUrl,
      };

      console.log("Final payload sent to /admin/createevent:", payload);

      // 4. Submit to backend
      const res = await axios.post(
        `${BASE_URL}/admin/createevent`,
        payload,
        { withCredentials: true }
      );

      alert("Event created successfully!");
      console.log("CreateEvent response:", res.data);
    } catch (err) {
      console.error("Error in CreateEvent handleSubmit:", err);
      if (err.response) {
        console.error("Backend error:", err.response.data);
        alert(
          err.response.data.message ||
            err.response.data.error ||
            "Error creating event."
        );
      } else {
        alert("Error creating event. Check console for details.");
      }
    }
  };

  // ... keep the rest of your JSX and sub-components as-is


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <div>
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label>Caption</label>
          <input
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label>Month</label>
          <input
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* IMAGES */}
        <div>
          <label>Event Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <div>
          <label>Event Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files[0])}
          />
        </div>

        {/* DATE FIELDS */}
        <div>
          <label>Starts At</label>
          <input
            type="datetime-local"
            name="startsAt"
            value={formData.startsAt}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label>Ends At</label>
          <input
            type="datetime-local"
            name="endsAt"
            value={formData.endsAt}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* DESCRIPTIONS */}
        <div>
          <label>Short Description</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="input"
          />
        </div>

        <div>
          <label>Long Description</label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* ACTION STEPS */}
        <ActionSteps
          items={formData.actionSteps}
          addItem={(step) => addItem("actionSteps", step)}
        />

        {/* CHECKLIST */}
        <ChecklistItems
          items={formData.checkListItems}
          addItem={(chk) => addItem("checkListItems", chk)}
        />

        {/* REQUIREMENTS */}
        <Requirements
          items={formData.requirements}
          addItem={(req) => addItem("requirements", req)}
        />

        {/* FAQ */}
        <FAQs
          items={formData.FAQs}
          addItem={(faq) => addItem("FAQs", faq)}
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

// =========================================
// SUB COMPONENTS
// =========================================

const ActionSteps = ({ items, addItem }) => {
  // step-level state
  const [step, setStep] = useState({
    stepNumber: "",
    title: "",
    isRequired: false,
    contentBlocks: [],
  });

  // current content block
  const [block, setBlock] = useState({
    heading: "",
    text: "",
    links: [],
  });

  // current link inside a block
  const [link, setLink] = useState({
    label: "",
    url: "",
  });

  const handleAddLinkToBlock = () => {
    if (!link.label.trim() || !link.url.trim()) return;

    setBlock((prev) => ({
      ...prev,
      links: [...prev.links, link],
    }));

    setLink({ label: "", url: "" });
  };

  const handleAddBlockToStep = () => {
    if (!block.heading.trim() && !block.text.trim()) return;

    setStep((prev) => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, block],
    }));

    setBlock({
      heading: "",
      text: "",
      links: [],
    });
    setLink({ label: "", url: "" });
  };

  const handleAddStep = () => {
    if (!step.stepNumber || !step.title.trim()) return;
    if (step.contentBlocks.length === 0) return;

    const newStep = {
      stepNumber: Number(step.stepNumber),
      title: step.title.trim(),
      isRequired: step.isRequired,
      isCompleted: false, // default value
      contentBlocks: step.contentBlocks,
    };

    addItem(newStep);

    // reset everything
    setStep({
      stepNumber: "",
      title: "",
      isRequired: false,
      contentBlocks: [],
    });
    setBlock({
      heading: "",
      text: "",
      links: [],
    });
    setLink({ label: "", url: "" });
  };

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg mb-2">Action Steps</h2>

      {/* Existing steps preview */}
      {items.map((s, i) => (
        <div key={i} className="border p-3 rounded mb-2">
          <div className="font-semibold">
            Step {s.stepNumber}: {s.title}{" "}
            {s.isRequired && (
              <span className="text-xs text-red-600">(Required)</span>
            )}
          </div>

          {s.contentBlocks?.map((b, idx) => (
            <div key={idx} className="mt-1 ml-3 text-sm">
              {b.heading && (
                <p className="font-semibold">{b.heading}</p>
              )}
              {b.text && <p>{b.text}</p>}
              {b.links?.length > 0 && (
                <ul className="list-disc ml-5 mt-1">
                  {b.links.map((lnk, j) => (
                    <li key={j}>
                      {lnk.label} ({lnk.url})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* New step builder */}
      <div className="space-y-3 mt-4 border-t pt-4">
        <div className="flex gap-3">
          <input
            placeholder="Step Number"
            type="number"
            className="input w-32"
            value={step.stepNumber}
            onChange={(e) =>
              setStep({ ...step, stepNumber: e.target.value })
            }
          />

          <input
            placeholder="Step Title (e.g., Learn About Blood Donation)"
            className="input flex-1"
            value={step.title}
            onChange={(e) =>
              setStep({ ...step, title: e.target.value })
            }
          />
        </div>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={step.isRequired}
            onChange={(e) =>
              setStep({ ...step, isRequired: e.target.checked })
            }
          />
          Required step
        </label>

        {/* Content block builder */}
        <div className="mt-3 p-3 border rounded space-y-3">
          <p className="font-semibold text-sm">Add Content Block</p>

          <input
            placeholder="Section Heading (optional)"
            className="input"
            value={block.heading}
            onChange={(e) =>
              setBlock({ ...block, heading: e.target.value })
            }
          />

          <textarea
            placeholder="Paragraph text"
            className="input"
            value={block.text}
            onChange={(e) =>
              setBlock({ ...block, text: e.target.value })
            }
          />

          {/* Links for this block */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                placeholder="Link Label"
                className="input flex-1"
                value={link.label}
                onChange={(e) =>
                  setLink({ ...link, label: e.target.value })
                }
              />
              <input
                placeholder="Link URL"
                className="input flex-1"
                value={link.url}
                onChange={(e) =>
                  setLink({ ...link, url: e.target.value })
                }
              />
              <button
                type="button"
                className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                onClick={handleAddLinkToBlock}
              >
                Add Link
              </button>
            </div>

            {block.links.length > 0 && (
              <ul className="list-disc ml-5 text-sm">
                {block.links.map((lnk, i) => (
                  <li key={i}>
                    {lnk.label} ({lnk.url})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
            onClick={handleAddBlockToStep}
          >
            Add Content Block to Step
          </button>
        </div>

        {/* Current blocks summary for this step */}
        {step.contentBlocks.length > 0 && (
          <div className="mt-3 text-sm">
            <p className="font-semibold mb-1">
              Content blocks for this step:
            </p>
            {step.contentBlocks.map((b, idx) => (
              <p key={idx} className="ml-3">
                • {b.heading || "Untitled section"}
              </p>
            ))}
          </div>
        )}

        <button
          type="button"
          className="bg-green-600 text-white px-4 py-1.5 rounded mt-2"
          onClick={handleAddStep}
        >
          Add Action Step
        </button>
      </div>
    </div>
  );
};

const ChecklistItems = ({ items, addItem }) => {
  const [chk, setChk] = useState({ text: "", isMandatory: false });

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg">Checklist Items</h2>

      {items.map((c, i) => (
        <p key={i}>✔ {c.text}</p>
      ))}

      <div className="space-y-2 mt-2">
        <input
          placeholder="Checklist Item"
          className="input"
          value={chk.text}
          onChange={(e) => setChk({ ...chk, text: e.target.value })}
        />

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={chk.isMandatory}
            onChange={(e) =>
              setChk({ ...chk, isMandatory: e.target.checked })
            }
          />
          Mandatory
        </label>

        <button
          type="button"
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => {
            addItem(chk);
            setChk({ text: "", isMandatory: false });
          }}
        >
          Add Checklist
        </button>
      </div>
    </div>
  );
};

const Requirements = ({ items, addItem }) => {
  const [req, setReq] = useState({ title: "", description: "" });

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg">Requirements</h2>

      {items.map((r, i) => (
        <p key={i}>• {r.title}</p>
      ))}

      <div className="space-y-2 mt-2">
        <input
          placeholder="Requirement Title"
          className="input"
          value={req.title}
          onChange={(e) => setReq({ ...req, title: e.target.value })}
        />

        <textarea
          placeholder="Requirement Description"
          className="input"
          value={req.description}
          onChange={(e) =>
            setReq({ ...req, description: e.target.value })
          }
        />

        <button
          type="button"
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => {
            addItem(req);
            setReq({ title: "", description: "" });
          }}
        >
          Add Requirement
        </button>
      </div>
    </div>
  );
};

const FAQs = ({ items, addItem }) => {
  const [faq, setFaq] = useState({ question: "", answer: "" });

  return (
    <div className="mt-4">
      <h2 className="font-semibold text-lg">FAQs</h2>

      {items.map((f, i) => (
        <div key={i} className="mb-2">
          <b>Q:</b> {f.question}
          <br />
          <b>A:</b> {f.answer}
        </div>
      ))}

      <div className="space-y-2 mt-2">
        <input
          placeholder="Question"
          className="input"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        />

        <textarea
          placeholder="Answer"
          className="input"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        />

        <button
          type="button"
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => {
            addItem(faq);
            setFaq({ question: "", answer: "" });
          }}
        >
          Add FAQ
        </button>
      </div>
    </div>
  );
};

export default CreateEvent;
