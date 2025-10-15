import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";

/* ---------- small UI helpers ---------- */
const CL = {
  input: "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
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
const FileInput = ({ label, onChange, accept, multiple = false }) => (
  <div>
    <label className={CL.label}>{label}</label>
    <input type="file" accept={accept} multiple={multiple} onChange={onChange} className={CL.file} />
  </div>
);
const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (opt) => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
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
    <label className={CL.label}>
      Website or Social Media <span className="text-xs text-gray-600">(https:// required)</span>
    </label>
    {links.map((l, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input
          className={CL.input}
          placeholder="https://example.org"
          value={l}
          onChange={(e) => {
            const next = [...links];
            next[i] = e.target.value;
            setLinks(next);
          }}
        />
        {links.length > 1 && (
          <button type="button" className="px-2 py-1 text-sm text-red-500" onClick={() => setLinks(links.filter((_, x) => x !== i))}>
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

/* ---------- options (short, matches your form) ---------- */
const PARTICIPATION = [
  "Host or co-host a health literacy workshop or virtual discussion",
  "Promote health awareness content or wellness challenges",
  "Assign a representative to participate in quarterly PACE review",
  "Submit a success story, testimonial, or video for community visibility",
  "Promote the program through your newsletter, email list, or social media",
];
const PROGRAM_FIT = [
  "Mental Health / Stress Awareness",
  "Youth & Education",
  "Health Equity & Access",
];

/* ---------- main component ---------- */
const NonProfitRegister = () => {
  // Section 1
  const [legalName, setLegalName] = useState("");
  const [stateIncorp, setStateIncorp] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [missionStatement, setMissionStatement] = useState("");
  const [programsSummary, setProgramsSummary] = useState("");
  const [determinationLetter, setDeterminationLetter] = useState(null); // EIN/501(c)(3) Determination

  // Section 2 uploads
  const [taxExemptLetter, setTaxExemptLetter] = useState(null);
  const [goodStandingCert, setGoodStandingCert] = useState(null);
  const [impactSummary, setImpactSummary] = useState(null);
  const [mediaKit, setMediaKit] = useState([]); // up to 5 files

  // Section 3–5
  const [participationReadiness, setParticipationReadiness] = useState([]);
  const [alignWithMedwell, setAlignWithMedwell] = useState("");
  const [pastCampaign, setPastCampaign] = useState("");
  const [desiredImpact, setDesiredImpact] = useState("");
  const [programFit, setProgramFit] = useState([]);

  // Agreements
  const [agreements, setAgreements] = useState({
    agreeMonthlyOrQuarterly: false,
    understandPerformance: false,
    agreeCoMarketing: false,
    acknowledgeOngoing: false,
    agreeShareMetrics: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!validator.isEmail(contactEmail)) return "Please enter a valid email.";
    const links = socialLinks.map((s) => s.trim()).filter(Boolean);
    if (links.some((u) => !validator.isURL(u, { require_protocol: true })))
      return "All social links must be valid URLs (with https://).";
    if (participationReadiness.length < 5) return "Select at least 5 participation activities.";
    if (!Object.values(agreements).every(Boolean)) return "Please accept all agreement checkboxes.";
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

      // Section 1
      fd.append("legalName", legalName);
      if (determinationLetter) fd.append("determinationLetter", determinationLetter);
      fd.append("stateIncorp", stateIncorp);
      fd.append("contactName", contactName);
      fd.append("contactTitle", contactTitle);
      fd.append("contactPhone", contactPhone);
      fd.append("contactEmail", contactEmail);
      fd.append("socialLinks", JSON.stringify(socialLinks.map((s) => s.trim()).filter(Boolean)));
      fd.append("missionStatement", missionStatement);
      fd.append("programsSummary", programsSummary);

      // Section 2 uploads
      if (taxExemptLetter) fd.append("taxExemptLetter", taxExemptLetter);
      if (goodStandingCert) fd.append("goodStandingCert", goodStandingCert);
      if (impactSummary) fd.append("impactSummary", impactSummary);
      mediaKit.forEach((f) => fd.append("mediaKit", f));

      // Section 3–5
      fd.append("participationReadiness", JSON.stringify(participationReadiness));
      fd.append("alignWithMedwell", alignWithMedwell);
      fd.append("pastCampaign", pastCampaign);
      fd.append("desiredImpact", desiredImpact);
      fd.append("programFit", JSON.stringify(programFit));

      // Agreements
      Object.entries(agreements).forEach(([k, v]) => fd.append(k, v));

      await axios.post(`${BASE_URL}/non-profit/vetting`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSuccess("Non-profit registration submitted successfully!");
    } catch {
      setError("Submission failed. Please check your input.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Non-Profit Registration</h2>

      {/* Section 1: General Info + Determination Letter */}
      <Section title="Section 1: General Information">
        <TextField label="Legal Organization Name" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
        <FileInput label="EIN / 501(c)(3) Determination Letter (PDF/Image)" accept="application/pdf,image/*"
                   onChange={(e) => setDeterminationLetter(e.target.files[0])} />
        <TextField label="State of Incorporation" value={stateIncorp} onChange={(e) => setStateIncorp(e.target.value)} />
        <TextField label="Primary Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
        <TextField label="Contact Title" value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} />
        <TextField label="Contact Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
        <TextField label="Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
        <SocialLinks links={socialLinks} setLinks={setSocialLinks} />
        <TextField textarea label="Mission Statement" value={missionStatement} onChange={(e) => setMissionStatement(e.target.value)} />
        <TextField textarea label="Summary of Key Programs / Services" value={programsSummary} onChange={(e) => setProgramsSummary(e.target.value)} />
      </Section>

      {/* Section 2: Eligibility & Documentation */}
      <Section title="Section 2: Eligibility & Documentation">
        <FileInput label="IRS Tax-Exempt Status Verification (501(c)(3) Letter)" accept="application/pdf,image/*"
                   onChange={(e) => setTaxExemptLetter(e.target.files[0])} />
        <FileInput label="Certificate of Good Standing (optional)" accept="application/pdf,image/*"
                   onChange={(e) => setGoodStandingCert(e.target.files[0])} />
        <FileInput label="Impact Summary (PDF)" accept="application/pdf"
                   onChange={(e) => setImpactSummary(e.target.files[0])} />
        <FileInput label="Logo & Media Kit (up to 5 files)" accept="application/pdf,image/*" multiple
                   onChange={(e) => setMediaKit(Array.from(e.target.files).slice(0, 5))} />
      </Section>

      {/* Section 3: Participation Readiness */}
      <Section title="Section 3: Participation Readiness (select ≥5)">
        <CheckboxGroup options={PARTICIPATION} value={participationReadiness} onChange={setParticipationReadiness} />
      </Section>

      {/* Section 4: Alignment & Values */}
      <Section title="Section 4: Alignment & Values">
        <TextField textarea label="How does your mission align with Medwell’s goals?" value={alignWithMedwell} onChange={(e) => setAlignWithMedwell(e.target.value)} />
        <TextField textarea label="Describe a past campaign or event" value={pastCampaign} onChange={(e) => setPastCampaign(e.target.value)} />
        <TextField textarea label="What impact do you hope to achieve?" value={desiredImpact} onChange={(e) => setDesiredImpact(e.target.value)} />
      </Section>

      {/* Section 5: Program Fit */}
      <Section title="Section 5: Program Fit (awareness campaigns)">
        <CheckboxGroup options={PROGRAM_FIT} value={programFit} onChange={setProgramFit} />
      </Section>

      {/* Section 6: Agreement */}
      <Section title="Section 6: Agreement">
        {Object.entries({
          agreeMonthlyOrQuarterly: "Willing to participate in monthly or quarterly health awareness themes",
          understandPerformance: "Understand that Medwell may assign donations based on performance/activity",
          agreeCoMarketing: "Agree to be part of the Medwell co-marketing ecosystem",
          acknowledgeOngoing: "Acknowledge that ongoing participation is required to maintain active status",
          agreeShareMetrics: "Ready to share engagement metrics and testimonials upon request",
        }).map(([key, label]) => (
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
      </Section>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {success && <div className="text-green-600 mb-3">{success}</div>}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-3 rounded-md font-semibold text-white ${submitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default NonProfitRegister;
