import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";

/* ---------- Options ---------- */
const DOCTOR_PARTICIPATION_OPTIONS = [
  "Host or co-host a health literacy workshop or educational session",
  "Participate in a podcast, YouTube Live, or virtual series",
  "Offer health screenings or wellness assessments (can be basic)",
  "Provide QR code or link for patients to earn reward points",
  "Refer patients or staff to engage with Assign It Forward",
  "Guide staff to encourage positive patient behaviors (per OIG Advisory 2002)",
  "Submit monthly performance reports (visits, compliance, engagement)",
  "Sponsor or co-sponsor a cause-based campaign or awareness month",
  "Serve as a mentor to students or interns (optional)",
  "Participate in gamified events or campus challenges",
];

const CAMPAIGN_FIT_OPTIONS = [
  "Mental Health / Stress Awareness",
  "Autism & Neurodiversity",
  "Breast Cancer / Prostate Cancer",
  "Veterans & First Responders",
  "Preventive Screenings (Diabetes, Cervical, Mammogram)",
  "Healthy Vision, Sleep, or Heart Health",
  "Adolescent & College Health",
  "Nutrition & Obesity Prevention",
  "Chronic Care Management",
];

/* ---------- Tiny UI helpers ---------- */
const CL = {
  input:
    "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
  label: "block text-sm font-semibold text-gray-900 mb-1",
  card: "bg-white p-6 rounded-xl shadow mb-6",
  h3: "text-lg font-bold text-gray-900 mb-3",
  file:
    "block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none " +
    "file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold " +
    "file:bg-blue-600 file:text-white hover:file:bg-blue-700",
};
const Section = ({ title, children }) => (
  <section className={CL.card}>
    <h3 className={CL.h3}>{title}</h3>
    <div className="space-y-3">{children}</div>
  </section>
);
const TextField = ({ label, value, onChange, textarea = false, rows = 3 }) => (
  <div>
    <label className={CL.label}>{label}</label>
    {textarea ? (
      <textarea className={CL.input} rows={rows} value={value} onChange={onChange} />
    ) : (
      <input className={CL.input} value={value} onChange={onChange} />
    )}
  </div>
);
const FileInput = ({ label, accept, onChange }) => (
  <div>
    <label className={CL.label}>{label}</label>
    <input type="file" accept={accept} onChange={onChange} className={CL.file} />
  </div>
);
const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (opt) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex gap-2 text-sm text-gray-900">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
  );
};
const SocialLinks = ({ links, setLinks }) => (
  <div>
    <label className={CL.label}>
      Social Links <span className="text-xs text-gray-600">(https:// required)</span>
    </label>
    {links.map((l, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input
          className={CL.input}
          placeholder="https://example.com"
          value={l}
          onChange={(e) => {
            const next = [...links];
            next[i] = e.target.value;
            setLinks(next);
          }}
        />
        {links.length > 1 && (
          <button
            type="button"
            className="px-2 py-1 text-sm text-red-500"
            onClick={() => setLinks(links.filter((_, x) => x !== i))}
          >
            ×
          </button>
        )}
      </div>
    ))}
    <button
      type="button"
      className="text-blue-600 text-sm underline"
      onClick={() => setLinks([...links, ""])}
    >
      + Add another link
    </button>
  </div>
);

/* ---------- Main Component ---------- */
const DoctorRegister = () => {
  // Basic info
  const [clinicName, setClinicName] = useState("");
  const [practiceAddress, setPracticeAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);

  // Files
  const [businessLicense, setBusinessLicense] = useState(null);
  const [w9, setW9] = useState(null);
  const [logo, setLogo] = useState(null);
  const [headshot, setHeadshot] = useState(null);

  // HIPAA
  const [hipaaAcknowledged, setHipaaAcknowledged] = useState(false);

  // Participation & alignment
  const [participationOptions, setParticipationOptions] = useState([]);
  const [promoteEngagement, setPromoteEngagement] = useState("");
  const [meaningfulCauses, setMeaningfulCauses] = useState("");

  // Campaign fit (preset + custom)
  const [campaignFit, setCampaignFit] = useState([]);
  const [customCampaignFit, setCustomCampaignFit] = useState("");

  // UX
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const links = socialLinks.map((s) => s.trim()).filter(Boolean);
    if (links.some((u) => !validator.isURL(u, { require_protocol: true })))
      return "All social links must be valid URLs with protocol (https://...).";
    if (participationOptions.length < 5)
      return "Please select at least 5 participation activities.";
    if (campaignFit.length === 0 && customCampaignFit.trim().length === 0)
      return "Please select or add at least one campaign fit.";
    if (!hipaaAcknowledged)
      return "Please acknowledge HIPAA before submitting.";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) return setError(err);

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("clinicName", clinicName);
      formData.append("practiceAddress", practiceAddress);
      formData.append("website", website);
      formData.append(
        "socialLinks",
        JSON.stringify(socialLinks.map((s) => s.trim()).filter(Boolean))
      );
      if (businessLicense) formData.append("businessLicense", businessLicense);
      if (w9) formData.append("w9", w9);
      if (logo) formData.append("logo", logo);
      if (headshot) formData.append("headshot", headshot);
      formData.append("hipaaAcknowledged", hipaaAcknowledged);

      // participation
      formData.append(
        "participationOptions",
        JSON.stringify(participationOptions)
      );

      // alignment
      formData.append("promoteEngagement", promoteEngagement);
      formData.append("meaningfulCauses", meaningfulCauses);

      // campaign fit (merge preset + custom)
      let finalCampaignFit = [...campaignFit];
      if (customCampaignFit.trim()) {
        finalCampaignFit = [
          ...finalCampaignFit,
          ...customCampaignFit
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        ];
      }
      formData.append("campaignFit", JSON.stringify(finalCampaignFit));

      await axios.post(`${BASE_URL}/doctor/vetting`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSuccess("Doctor details submitted successfully!");
    } catch {
      setError("Submission failed. Please check your input.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Doctor Registration</h2>

      {/* Section 1: Basic Info */}
      <Section title="Section 1: Clinic Information">
        <TextField label="Clinic Name" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
        <TextField label="Practice Address" value={practiceAddress} onChange={(e) => setPracticeAddress(e.target.value)} />
        <TextField label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <SocialLinks links={socialLinks} setLinks={setSocialLinks} />
      </Section>

      {/* Section 2: Compliance & Branding */}
      <Section title="Section 2: Compliance & Branding">
        <FileInput label="Business License (PDF/Image)" accept="application/pdf,image/*" onChange={(e) => setBusinessLicense(e.target.files[0])} />
        <FileInput label="W-9 (PDF/Image)" accept="application/pdf,image/*" onChange={(e) => setW9(e.target.files[0])} />
        <FileInput label="Logo (Image)" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
        <FileInput label="Headshot (Image)" accept="image/*" onChange={(e) => setHeadshot(e.target.files[0])} />
        <label className="flex items-center gap-2 text-sm text-gray-900 mt-2">
          <input
            type="checkbox"
            className="accent-blue-600"
            checked={hipaaAcknowledged}
            onChange={() => setHipaaAcknowledged((v) => !v)}
          />
          HIPAA Acknowledged
        </label>
      </Section>

      {/* Section 3: Participation Options */}
      <Section title="Section 3: Participation Options (Select at least 5)">
        <CheckboxGroup
          options={DOCTOR_PARTICIPATION_OPTIONS}
          value={participationOptions}
          onChange={setParticipationOptions}
        />
        <div className="text-xs text-gray-600">Selected: {participationOptions.length}/5</div>
      </Section>

      {/* Section 4: Alignment & Causes */}
      <Section title="Section 4: Alignment & Causes">
        <TextField
          label="How do you currently promote patient engagement or wellness?"
          value={promoteEngagement}
          onChange={(e) => setPromoteEngagement(e.target.value)}
        />
        <TextField
          label="What causes or community populations are most meaningful to your practice?"
          value={meaningfulCauses}
          onChange={(e) => setMeaningfulCauses(e.target.value)}
        />
      </Section>

      {/* Section 5: Campaign Fit */}
      <Section title="Section 5: Campaign Fit">
        <CheckboxGroup options={CAMPAIGN_FIT_OPTIONS} value={campaignFit} onChange={setCampaignFit} />
        <input
          className={`${CL.input} mt-2`}
          placeholder="Add custom cause(s), comma separated"
          value={customCampaignFit}
          onChange={(e) => setCustomCampaignFit(e.target.value)}
        />
        <div className="text-xs text-gray-600">Select or add at least one.</div>
      </Section>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {success && <div className="text-green-600 mb-3">{success}</div>}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3 rounded-md font-semibold text-white ${
          submitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default DoctorRegister;
