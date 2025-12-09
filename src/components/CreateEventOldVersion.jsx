import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/s3Upload";

const CreateEventOldVersion = () => {
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

    try {
      // 1. Upload thumbnail image
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadFileToS3(imageFile);
      }

      // 2. Upload banner image
      let bannerImageUrl = "";
      if (bannerFile) {
        bannerImageUrl = await uploadFileToS3(bannerFile);
      }

      // 3. Build final payload
      const payload = {
        ...formData,
        imageUrl,
        bannerImageUrl,
      };
        
      // 4. Submit to backend
      const res = await axios.post(
        `${BASE_URL}/admin/createevent`,
        payload,
        { withCredentials: true }
      );

      alert("Event created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error creating event.");
    }
  };

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
  const [step, setStep] = useState({
    stepNumber: "",
    title: "",
    description: "",
    isRequired: false,
  });

  return (
    <div>
      <h2 className="font-semibold text-lg">Action Steps</h2>

      {items.map((s, i) => (
        <div key={i} className="border p-2 rounded mb-2">
          <b>Step {s.stepNumber}:</b> {s.title}
          <p>{s.description}</p>
        </div>
      ))}

      <div className="space-y-2 mt-2">
        <input
          placeholder="Step Number"
          type="number"
          className="input"
          value={step.stepNumber}
          onChange={(e) =>
            setStep({ ...step, stepNumber: e.target.value })
          }
        />

        <input
          placeholder="Title"
          className="input"
          value={step.title}
          onChange={(e) => setStep({ ...step, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="input"
          value={step.description}
          onChange={(e) =>
            setStep({ ...step, description: e.target.value })
          }
        />

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={step.isRequired}
            onChange={(e) =>
              setStep({ ...step, isRequired: e.target.checked })
            }
          />
          Required
        </label>

        <button
          type="button"
          className="bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => {
            addItem(step);
            setStep({
              stepNumber: "",
              title: "",
              description: "",
              isRequired: false,
            });
          }}
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

export default CreateEventOldVersion;