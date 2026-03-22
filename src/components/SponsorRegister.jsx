import React, { useMemo, useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/s3Upload";

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
  agreeImpactProgram:
    "My sponsorship supports a point-based, impact-driven initiative",
  agreePublicListing: "I agree to be publicly listed as a partner/sponsor",
  acknowledgeCommunity: "I acknowledge this is a community benefit platform",
  agreeQuarterlyReport: "I’m open to quarterly CSR / PACE impact reports",
  agreeParticipate12mo:
    "I agree to participate in at least one campaign within 12 months",
};

/* =========================================================
   Medwell Theme (Keep 2,3,4)
   - Signup / marketing: peach/orange gradient, coral CTA, pastel chips, rounded white card, soft shadow
   - Login: clean white background, #e13429 primary button
   - General: soft gray borders, rounded cards, friendly/pastel but restrained
   ========================================================= */
const MW = {
  pageBg: "bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50",
  cardBg: "bg-white/90 backdrop-blur",
  border: "border border-slate-200/80",
  shadow: "shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
  rounded: "rounded-3xl",
  heading: "text-slate-900",
  text: "text-slate-600",
  hint: "text-slate-500",
  coralBtn:
    "bg-[#e13429] hover:bg-[#c92d25] active:bg-[#b82620] text-white",
  coralRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e13429]/40",
  input:
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#e13429]/40 focus:ring-2 focus:ring-[#e13429]/20",
  textarea:
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#e13429]/40 focus:ring-2 focus:ring-[#e13429]/20",
  select:
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-[#e13429]/40 focus:ring-2 focus:ring-[#e13429]/20",
  file:
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200",
  chip:
    "inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100",
  checkboxWrap:
    "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition",
  checkbox:
    "mt-1 h-5 w-5 rounded-md border-slate-300 text-[#e13429] focus:ring-[#e13429]/30",
  section:
    "bg-white/90 backdrop-blur border border-slate-200/80 rounded-3xl shadow-[0_8px_24px_rgba(15,23,42,0.06)] p-6",
};

const Section = ({ title, chip, children }) => (
  <section className={MW.section}>
    <div className="flex items-start justify-between gap-3 mb-4">
      <h3 className={`text-lg sm:text-xl font-extrabold ${MW.heading}`}>
        {title}
      </h3>
      {chip ? <span className={MW.chip}>{chip}</span> : null}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const TextField = ({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  placeholder,
  type = "text",
  required = false,
}) => (
  <label className="block">
    <div className="mb-1.5">
      <span className={`text-sm font-semibold ${MW.heading}`}>{label}</span>
      {required ? (
        <span className="ml-1 text-xs font-semibold text-rose-600">*</span>
      ) : null}
    </div>

    {textarea ? (
      <textarea
        className={MW.textarea}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ) : (
      <input
        className={MW.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
    )}
  </label>
);

const FileInput = ({ label, accept, onChange, helper }) => (
  <label className="block">
    <div className="mb-1.5">
      <span className={`text-sm font-semibold ${MW.heading}`}>{label}</span>
    </div>
    <input type="file" accept={accept} onChange={onChange} className={MW.file} />
    {helper ? <div className={`mt-1 text-xs ${MW.hint}`}>{helper}</div> : null}
  </label>
);

const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (v) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className={MW.checkboxWrap}>
          <input
            type="checkbox"
            className={MW.checkbox}
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span className={`text-sm ${MW.text}`}>{opt}</span>
        </label>
      ))}
    </div>
  );
};

const SocialLinks = ({ links, setLinks }) => (
  <div>
    <div className="flex items-end justify-between gap-3 mb-2">
      <div>
        <div className={`text-sm font-semibold ${MW.heading}`}>
          Website or Social Media
        </div>
        <div className={`text-xs ${MW.hint}`}>(https:// required)</div>
      </div>

      <button
        type="button"
        className={`rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 ${MW.coralRing}`}
        onClick={() => setLinks([...links, ""])}
      >
        + Add link
      </button>
    </div>

    <div className="space-y-2">
      {links.map((l, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={MW.input}
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
              className={`shrink-0 rounded-full border border-slate-200 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 ${MW.coralRing}`}
              onClick={() => setLinks(links.filter((_, x) => x !== i))}
              aria-label="Remove link"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

const Alert = ({ type = "error", children }) => {
  const base =
    "rounded-2xl border px-4 py-3 text-sm font-semibold flex items-start gap-2";
  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";
  return <div className={`${base} ${styles}`}>{children}</div>;
};

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

  const entityOptions = useMemo(
    () => ["Corporation", "Small Business", "Foundation", "B Corp", "Other"],
    []
  );

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

      // Upload files to S3, get back URLs
      const [logoUrl, styleGuideUrl, marketingLanguageUrl, w9OrReceiptUrl, liaisonDocUrl] =
        await Promise.all([
          logo              ? uploadFileToS3(logo)              : Promise.resolve(""),
          styleGuide        ? uploadFileToS3(styleGuide)        : Promise.resolve(""),
          marketingLanguage ? uploadFileToS3(marketingLanguage) : Promise.resolve(""),
          w9OrReceipt       ? uploadFileToS3(w9OrReceipt)       : Promise.resolve(""),
          liaisonDoc        ? uploadFileToS3(liaisonDoc)        : Promise.resolve(""),
        ]);

      await axios.post(
        `${BASE_URL}/sponsor/vetting`,
        {
          businessName,
          entityType,
          contactName,
          contactEmail,
          contactPhone,
          socialLinks: socialLinks.map((s) => s.trim()).filter(Boolean),
          missionValues,
          csrEsgOverview,
          logoUrl,
          styleGuideUrl,
          marketingLanguageUrl,
          w9OrReceiptUrl,
          liaisonDocUrl,
          sponsorshipGoals,
          fundingModels,
          activationReadiness,
          causeAlignment,
          ...agreements,
        },
        { withCredentials: true }
      );

      setSuccess("Sponsor registration submitted successfully!");
    } catch (err2) {
      setError(
        err2?.response?.data?.error ||
          err2?.response?.data?.message ||
          "Submission failed. Please check your input."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${MW.pageBg} px-4 py-10`}>
      <div className="mx-auto max-w-5xl">
        <div
          className={`${MW.cardBg} ${MW.border} ${MW.shadow} ${MW.rounded} overflow-hidden`}
        >
          {/* Header */}
          <div className="px-6 sm:px-10 py-8 border-b border-slate-200/70">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="inline-flex items-center gap-2">
                <span className={MW.chip}>Partner</span>
                <span className={MW.chip}>Sponsor</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl font-extrabold ${MW.heading}`}>
                Sponsor Registration
              </h2>
              <p className={`max-w-2xl text-sm sm:text-base ${MW.text}`}>
                Join Medwell as a sponsor and power point-based impact campaigns.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Fields marked <span className="text-[#e13429] font-bold">*</span> are required
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="px-6 sm:px-10 py-8 space-y-6">
            <Section title="Section 1: Organization Overview" chip="Basics">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                  label="Organization Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Acme Health Inc."
                  required
                />

                <label className="block">
                  <div className="mb-1.5">
                    <span className={`text-sm font-semibold ${MW.heading}`}>
                      Type of Entity
                    </span>
                    <span className="ml-1 text-xs font-semibold text-rose-600">
                      *
                    </span>
                  </div>
                  <select
                    className={MW.select}
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    required
                  >
                    <option value="">Select type</option>
                    {entityOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <TextField
                  label="Primary Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Full name"
                  required
                />
                <TextField
                  label="Contact Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@company.com"
                  type="email"
                  required
                />
                <TextField
                  label="Contact Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (___) ___-____"
                  required
                />
              </div>

              <SocialLinks links={socialLinks} setLinks={setSocialLinks} />

              <TextField
                textarea
                rows={4}
                label="Company Mission & Values"
                value={missionValues}
                onChange={(e) => setMissionValues(e.target.value)}
                placeholder="Share a short summary of your mission and values…"
              />
              <TextField
                textarea
                rows={4}
                label="Brief CSR / ESG Overview"
                value={csrEsgOverview}
                onChange={(e) => setCsrEsgOverview(e.target.value)}
                placeholder="Tell us how you approach CSR / ESG initiatives…"
              />
            </Section>

            <Section title="Section 2: Brand Guidelines & Legal" chip="Docs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FileInput
                  label="High-resolution Logo (Image)"
                  accept="image/*"
                  onChange={(e) => setLogo(e.target.files?.[0] || null)}
                  helper="PNG/SVG preferred."
                />
                <FileInput
                  label="Brand Style Guide (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setStyleGuide(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="Approved Marketing Language (PDF)"
                  accept="application/pdf"
                  onChange={(e) =>
                    setMarketingLanguage(e.target.files?.[0] || null)
                  }
                />
                <FileInput
                  label="W-9 / Receipt Documentation (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setW9OrReceipt(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="Designated Liaison Doc (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setLiaisonDoc(e.target.files?.[0] || null)}
                />
              </div>
            </Section>

            <Section title="Section 3: Sponsorship Goals" chip="Select all that apply">
              <CheckboxGroup
                options={SPONSORSHIP_GOALS}
                value={sponsorshipGoals}
                onChange={setSponsorshipGoals}
              />
            </Section>

            <Section title="Section 4: Funding Commitment" chip="Select all that apply">
              <CheckboxGroup
                options={FUNDING_MODELS}
                value={fundingModels}
                onChange={setFundingModels}
              />
            </Section>

            <Section title="Section 5: Activation Readiness" chip="Select all that apply">
              <CheckboxGroup
                options={ACTIVATION}
                value={activationReadiness}
                onChange={setActivationReadiness}
              />
            </Section>

            <Section title="Section 6: Cause Alignment" chip="Select all that apply">
              <CheckboxGroup
                options={CAUSE_AREAS}
                value={causeAlignment}
                onChange={setCauseAlignment}
              />
            </Section>

            <Section title="Section 7: Agreement" chip="Required">
              <div className="space-y-2">
                {Object.entries(AGREEMENT_LABELS).map(([key, label]) => (
                  <label key={key} className={MW.checkboxWrap}>
                    <input
                      type="checkbox"
                      className={MW.checkbox}
                      checked={agreements[key]}
                      onChange={() =>
                        setAgreements((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                    />
                    <span className={`text-sm ${MW.text}`}>{label}</span>
                  </label>
                ))}
              </div>
            </Section>

            {error ? <Alert type="error">{error}</Alert> : null}
            {success ? <Alert type="success">{success}</Alert> : null}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-full px-5 py-3 text-base font-extrabold ${MW.coralBtn} ${MW.coralRing} ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>

            <p className={`text-center text-xs ${MW.hint}`}>
              By submitting, you agree to Medwell’s partner onboarding process.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SponsorRegister;