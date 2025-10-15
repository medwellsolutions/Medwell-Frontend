import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";

/* ---------- Options ---------- */
const SPONSORSHIP_GOALS = [
  "Donate funds tied to point-based activities",
  "Match points earned by participants with monetary donations",
  "Offer in-kind rewards (gift cards, merchandise, experiences)",
  "Sponsor an awareness month (e.g. Autism, Stress, Breast Cancer)",
  "Provide scholarship or grant funds for student participants",
  "Engage in co-branded content (podcasts, livestreams, event booths)",
  "Sponsor a challenge (e.g. 5K, trivia, Wheel of Impact)",
  "Contribute toward performance-based community rebates",
  "Provide volunteers or ambassadors from your workforce",
];
const FUNDING_MODELS = [
  "Monthly recurring donation",
  "Match-based donations",
  "Awareness campaign sponsorship (flat-rate or tiered)",
  "Product placement or in-kind donation value",
  "One-time scholarship or nonprofit grant funding",
  "Other",
];
const ACTIVATION = [
  "Approve use of your logo for community marketing",
  "Submit a company rep for a podcast or livestream",
  "Attend or co-sponsor a community or campus event",
  "Review quarterly PACE impact reports",
  "Promote program internally via email/newsletter",
  "Provide a 60–90 second brand video or testimonial",
  "Engage staff in volunteer or Assign It Forward team day",
  "Join monthly cause-aligned initiatives as featured sponsor",
  "Offer special rewards or discounts tied to point campaigns",
];
const CAUSE_AREAS = [
  "Mental Health Awareness",
  "Veterans & First Responders",
  "Autism & Neurodiversity",
  "Cancer (Breast, Prostate, Pediatric, etc.)",
  "Student Wellness & College Health",
  "Women’s Health",
  "Diabetes & Heart Disease",
  "Underserved Communities",
  "Health Literacy & Access",
];
const AGREEMENT_LABELS = {
  agreeImpactProgram: "My sponsorship supports a point-based, impact-driven initiative",
  agreePublicListing: "I agree to be publicly listed as a partner/sponsor",
  acknowledgeCommunity: "I acknowledge this is a community benefit platform",
  agreeQuarterlyReport: "I’m open to quarterly CSR / PACE impact reports",
  agreeParticipate12mo: "I agree to participate in at least one campaign within 12 months",
};

/* ---------- Tiny UI helpers ---------- */
const CLASSES = {
  input: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
  label: "block text-sm font-semibold text-gray-900 mb-1",
  card: "bg-white p-6 rounded-xl shadow mb-6",
  h3: "text-lg font-bold text-gray-900 mb-3",
  file:
    "block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none " +
    "file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700",
};

const Section = ({ title, children }) => (
  <section className={CLASSES.card}>
    <h3 className={CLASSES.h3}>{title}</h3>
    <div className="space-y-3">{children}</div>
  </section>
);

const TextField = ({ label, value, onChange, textarea = false, ...rest }) => (
  <div>
    <label className={CLASSES.label}>{label}</label>
    {textarea ? (
      <textarea className={CLASSES.input} rows={rest.rows ?? 3} value={value} onChange={onChange} />
    ) : (
      <input className={CLASSES.input} value={value} onChange={onChange} />
    )}
  </div>
);

const FileInput = ({ label, accept, onChange }) => (
  <div>
    <label className={CLASSES.label}>{label}</label>
    <input type="file" accept={accept} onChange={onChange} className={CLASSES.file} />
  </div>
);

const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex gap-2 text-sm text-gray-900">
          <input type="checkbox" className="accent-blue-600" checked={value.includes(opt)} onChange={() => toggle(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
};

const SocialLinks = ({ links, setLinks }) => (
  <div>
    <label className={CLASSES.label}>
      Website or Social Media <span className="text-xs text-gray-600">(https:// required)</span>
    </label>
    {links.map((l, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input
          className={CLASSES.input}
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
    <button type="button" className="text-blue-600 text-sm underline" onClick={() => setLinks([...links, ""])}>
      + Add another link
    </button>
  </div>
);

/* ---------- Main Component ---------- */
const SponsorRegister = () => {
  const [businessName, setBusinessName] = useState("");
  const [entityType, setEntityType] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [missionValues, setMissionValues] = useState("");
  const [csrEsgOverview, setCsrEsgOverview] = useState("");

  const [logo, setLogo] = useState(null);
  const [styleGuide, setStyleGuide] = useState(null);
  const [marketingLanguage, setMarketingLanguage] = useState(null);
  const [w9OrReceipt, setW9OrReceipt] = useState(null);
  const [liaisonDoc, setLiaisonDoc] = useState(null);

  const [sponsorshipGoals, setSponsorshipGoals] = useState([]);
  const [fundingModels, setFundingModels] = useState([]);
  const [activationReadiness, setActivationReadiness] = useState([]);
  const [causeAlignment, setCauseAlignment] = useState([]);
  const [agreements, setAgreements] = useState(
    Object.fromEntries(Object.keys(AGREEMENT_LABELS).map((k) => [k, false]))
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!validator.isEmail(contactEmail)) return "Enter a valid email address.";
    const links = socialLinks.map((s) => s.trim()).filter(Boolean);
    if (links.some((url) => !validator.isURL(url, { require_protocol: true })))
      return "All social links must be valid URLs (with https://).";
    if (!Object.values(agreements).every(Boolean))
      return "Please accept all agreement checkboxes.";
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
      const fd = new FormData();
      fd.append("businessName", businessName);
      fd.append("entityType", entityType);
      fd.append("contactName", contactName);
      fd.append("contactEmail", contactEmail);
      fd.append("contactPhone", contactPhone);
      fd.append("socialLinks", JSON.stringify(socialLinks.map((s) => s.trim()).filter(Boolean)));
      fd.append("missionValues", missionValues);
      fd.append("csrEsgOverview", csrEsgOverview);
      if (logo) fd.append("logo", logo);
      if (styleGuide) fd.append("styleGuide", styleGuide);
      if (marketingLanguage) fd.append("marketingLanguage", marketingLanguage);
      if (w9OrReceipt) fd.append("w9OrReceipt", w9OrReceipt);
      if (liaisonDoc) fd.append("liaisonDoc", liaisonDoc);
      fd.append("sponsorshipGoals", JSON.stringify(sponsorshipGoals));
      fd.append("fundingModels", JSON.stringify(fundingModels));
      fd.append("activationReadiness", JSON.stringify(activationReadiness));
      fd.append("causeAlignment", JSON.stringify(causeAlignment));
      Object.entries(AGREEMENT_LABELS).forEach(([k]) => fd.append(k, agreements[k]));

      await axios.post(`${BASE_URL}/sponsor/vetting`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSuccess("Sponsor registration submitted successfully!");
    } catch {
      setError("Submission failed. Please check your input.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Sponsor Registration</h2>

        <Section title="Section 1: Organization Overview">
          <TextField label="Organization Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Type of Entity
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              {['Corporation', 'Small Business', 'Foundation', 'B Corp', 'Other'].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>
          <TextField label="Primary Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <TextField label="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          <TextField label="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          <SocialLinks links={socialLinks} setLinks={setSocialLinks} />
          <TextField textarea label="Company Mission & Values" value={missionValues} onChange={(e) => setMissionValues(e.target.value)} />
          <TextField textarea label="Brief CSR / ESG Overview" value={csrEsgOverview} onChange={(e) => setCsrEsgOverview(e.target.value)} />
        </Section>

      <Section title="Section 2: Brand Guidelines & Legal">
        <FileInput label="High-resolution Logo (Image)" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
        <FileInput label="Brand Style Guide (PDF)" accept="application/pdf" onChange={(e) => setStyleGuide(e.target.files[0])} />
        <FileInput label="Approved Marketing Language (PDF)" accept="application/pdf" onChange={(e) => setMarketingLanguage(e.target.files[0])} />
        <FileInput label="W-9 / Receipt Documentation (PDF)" accept="application/pdf" onChange={(e) => setW9OrReceipt(e.target.files[0])} />
        <FileInput label="Designated Liaison Doc (PDF)" accept="application/pdf" onChange={(e) => setLiaisonDoc(e.target.files[0])} />
      </Section>

      <Section title="Section 3: Sponsorship Goals">
        <CheckboxGroup options={SPONSORSHIP_GOALS} value={sponsorshipGoals} onChange={setSponsorshipGoals} />
      </Section>

      <Section title="Section 4: Funding Commitment">
        <CheckboxGroup options={FUNDING_MODELS} value={fundingModels} onChange={setFundingModels} />
      </Section>

      <Section title="Section 5: Activation Readiness">
        <CheckboxGroup options={ACTIVATION} value={activationReadiness} onChange={setActivationReadiness} />
      </Section>

      <Section title="Section 6: Cause Alignment">
        <CheckboxGroup options={CAUSE_AREAS} value={causeAlignment} onChange={setCauseAlignment} />
      </Section>

      <Section title="Section 7: Agreement">
        <div className="space-y-2">
          {Object.entries(AGREEMENT_LABELS).map(([key, label]) => (
            <label key={key} className="flex gap-2 text-sm text-gray-900">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={agreements[key]}
                onChange={() => setAgreements({ ...agreements, [key]: !agreements[key] })}
              />
              {label}
            </label>
          ))}
        </div>
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

export default SponsorRegister;
