import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/s3Upload";

/* ---------- options ---------- */
const PARTICIPATION = [
  "Host or co-host a health literacy workshop or virtual discussion",
  "Promote health awareness content or wellness challenges",
  "Assign a representative to participate in quarterly PACE review",
  "Submit a success story, testimonial, or video for community visibility",
  "Promote the program through your newsletter, email list, or social media",
  "Engage in student org collaborations or service hour tracking",
  "Share flyers or co-brand campaign materials provided by Medwell",
  "Co-develop cause-aligned Kahoot games or podcast topics",
  "Provide performance metrics or beneficiary stories upon request",
];

const PROGRAM_FIT = [
  "Mental Health / Stress Awareness",
  "Youth & Education",
  "Health Equity & Access",
  "Autism & Neurodiversity",
  "Cancer Support (e.g., Breast, Prostate, Pediatric)",
  "Nutrition, Fitness & Healthy Living",
  "Disability Inclusion",
  "Caregivers & Aging Adults",
];

/* ---------- small UI helpers (new theme) ---------- */
const Card = ({ title, subtitle, children }) => (
  <section className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
    <div className="mb-4">
      <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
        {title}
      </h3>
      {subtitle ? (
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      ) : null}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Field = ({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  placeholder = "",
  type = "text",
  required = false,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">
      {label}
      {required && <span className="ml-0.5 text-[#e13429]">*</span>}
    </label>
    {textarea ? (
      <textarea
        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ) : (
      <input
        className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
    )}
  </div>
);

const FileField = ({ label, onChange, accept, multiple = false, hint }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">
      {label}
    </label>
    {hint ? <p className="text-xs text-gray-500 mb-2">{hint}</p> : null}
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={onChange}
      className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
    />
  </div>
);

const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (opt) =>
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    );

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-start gap-3 text-sm text-gray-800"
        >
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#e13429] focus:ring-[#e13429]/30"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span className="leading-relaxed">{opt}</span>
        </label>
      ))}
    </div>
  );
};

const SocialLinks = ({ links, setLinks }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 mb-1">
      Website or Social Media{" "}
      <span className="text-xs text-gray-500">(https:// required)</span>
    </label>

    <div className="space-y-2">
      {links.map((l, i) => (
        <div key={i} className="flex gap-2">
          <input
            className="w-full border border-gray-200 rounded-xl px-4 h-11 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
            placeholder="https://example.org"
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
              className="h-11 w-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition inline-flex items-center justify-center"
              onClick={() => setLinks(links.filter((_, x) => x !== i))}
              aria-label="Remove link"
              title="Remove"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>

    <button
      type="button"
      className="mt-2 text-sm font-semibold text-[#e13429] hover:underline"
      onClick={() => setLinks([...links, ""])}
    >
      + Add another link
    </button>
  </div>
);

const Alert = ({ type = "error", children }) => {
  const styles =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-red-50 border-red-200 text-red-700";
  return (
    <div className={`border rounded-2xl px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
};

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
  const [determinationLetter, setDeterminationLetter] = useState(null);

  // Section 2 uploads
  const [taxExemptLetter, setTaxExemptLetter] = useState(null);
  const [goodStandingCert, setGoodStandingCert] = useState(null);
  const [impactSummary, setImpactSummary] = useState(null);
  const [mediaKit, setMediaKit] = useState([]);

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
    if (participationReadiness.length < 5)
      return "Select at least 5 participation activities.";
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
      const [
        determinationLetterUrl,
        taxExemptLetterUrl,
        goodStandingCertUrl,
        impactSummaryUrl,
        ...mediaKitUrls
      ] = await Promise.all([
        determinationLetter ? uploadFileToS3(determinationLetter) : Promise.resolve(""),
        taxExemptLetter     ? uploadFileToS3(taxExemptLetter)     : Promise.resolve(""),
        goodStandingCert    ? uploadFileToS3(goodStandingCert)    : Promise.resolve(""),
        impactSummary       ? uploadFileToS3(impactSummary)       : Promise.resolve(""),
        ...mediaKit.map((f) => uploadFileToS3(f)),
      ]);

      await axios.post(
        `${BASE_URL}/non-profit/vetting`,
        {
          legalName,
          stateIncorp,
          contactName,
          contactTitle,
          contactPhone,
          contactEmail,
          socialLinks: socialLinks.map((s) => s.trim()).filter(Boolean),
          missionStatement,
          programsSummary,
          determinationLetterUrl,
          taxExemptLetterUrl,
          goodStandingCertUrl,
          impactSummaryUrl,
          mediaKitUrls: mediaKitUrls.filter(Boolean),
          participationReadiness,
          alignWithMedwell,
          pastCampaign,
          desiredImpact,
          programFit,
          ...agreements,
        },
        { withCredentials: true }
      );

      setSuccess("Non-profit registration submitted successfully!");
    } catch (e2) {
      setError(
        e2?.response?.data?.error ||
          e2?.response?.data?.message ||
          "Submission failed. Please check your input."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-10">
      <form
        onSubmit={submit}
        className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Non-Profit Registration
          </h2>
          <p className="text-gray-600 mt-2">
            Share your details to get vetted and partner with Medwell campaigns.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Fields marked <span className="text-[#e13429] font-bold">*</span> are required
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <Card title="Section 1: General Information">
            <Field
              label="Legal Organization Name"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              required
            />
            <FileField
              label="EIN / 501(c)(3) Determination Letter"
              hint="PDF or Image"
              accept="application/pdf,image/*"
              onChange={(e) => setDeterminationLetter(e.target.files?.[0] || null)}
            />
            <Field
              label="State of Incorporation"
              value={stateIncorp}
              onChange={(e) => setStateIncorp(e.target.value)}
              required
            />
            <Field
              label="Primary Contact Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <Field
              label="Contact Title"
              value={contactTitle}
              onChange={(e) => setContactTitle(e.target.value)}
            />
            <Field
              label="Contact Phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
            <Field
              label="Contact Email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
            <SocialLinks links={socialLinks} setLinks={setSocialLinks} />
            <Field
              textarea
              label="Mission Statement"
              value={missionStatement}
              onChange={(e) => setMissionStatement(e.target.value)}
              rows={4}
              required
            />
            <Field
              textarea
              label="Summary of Key Programs / Services"
              value={programsSummary}
              onChange={(e) => setProgramsSummary(e.target.value)}
              rows={4}
              required
            />
          </Card>

          {/* Section 2 */}
          <Card title="Section 2: Eligibility & Documentation">
            <FileField
              label="IRS Tax-Exempt Status Verification (501(c)(3) Letter)"
              accept="application/pdf,image/*"
              onChange={(e) => setTaxExemptLetter(e.target.files?.[0] || null)}
            />
            <FileField
              label="Certificate of Good Standing (optional)"
              accept="application/pdf,image/*"
              onChange={(e) => setGoodStandingCert(e.target.files?.[0] || null)}
            />
            <FileField
              label="Impact Summary (PDF)"
              accept="application/pdf"
              onChange={(e) => setImpactSummary(e.target.files?.[0] || null)}
            />
            <FileField
              label="Logo & Media Kit (up to 5 files)"
              hint="PDF or images. We’ll store only the first 5."
              accept="application/pdf,image/*"
              multiple
              onChange={(e) =>
                setMediaKit(Array.from(e.target.files || []).slice(0, 5))
              }
            />
            {mediaKit.length > 0 && (
              <p className="text-xs text-gray-500">Selected: {mediaKit.length}/5</p>
            )}
          </Card>

          {/* Section 3 */}
          <Card
            title="Section 3: Participation Readiness"
            subtitle="Select at least 5 *"
          >
            <CheckboxGroup
              options={PARTICIPATION}
              value={participationReadiness}
              onChange={setParticipationReadiness}
            />
            <p className="text-xs text-gray-500">
              Selected: {participationReadiness.length}/5
            </p>
          </Card>

          {/* Section 4 */}
          <Card title="Section 4: Alignment & Values">
            <Field
              textarea
              label="How does your mission align with Medwell’s goals?"
              value={alignWithMedwell}
              onChange={(e) => setAlignWithMedwell(e.target.value)}
              rows={4}
              required
            />
            <Field
              textarea
              label="Describe a past campaign or event"
              value={pastCampaign}
              onChange={(e) => setPastCampaign(e.target.value)}
              rows={4}
              required
            />
            <Field
              textarea
              label="What impact do you hope to achieve?"
              value={desiredImpact}
              onChange={(e) => setDesiredImpact(e.target.value)}
              rows={4}
              required
            />
          </Card>

          {/* Section 5 */}
          <Card title="Section 5: Program Fit (awareness campaigns)">
            <CheckboxGroup
              options={PROGRAM_FIT}
              value={programFit}
              onChange={setProgramFit}
            />
          </Card>

          {/* Section 6 */}
          <Card title="Section 6: Agreement">
            {Object.entries({
              agreeMonthlyOrQuarterly:
                "Willing to participate in monthly or quarterly health awareness themes",
              understandPerformance:
                "Understand that Medwell may assign donations based on performance/activity",
              agreeCoMarketing:
                "Agree to be part of the Medwell co-marketing ecosystem",
              acknowledgeOngoing:
                "Acknowledge that ongoing participation is required to maintain active status",
              agreeShareMetrics:
                "Ready to share engagement metrics and testimonials upon request",
            }).map(([key, label]) => (
              <label key={key} className="flex items-start gap-3 text-sm text-gray-800">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#e13429] focus:ring-[#e13429]/30"
                  checked={agreements[key]}
                  onChange={() =>
                    setAgreements({ ...agreements, [key]: !agreements[key] })
                  }
                />
                <span className="leading-relaxed">{label}</span>
              </label>
            ))}
          </Card>

          {/* Alerts */}
          {error && <Alert type="error">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={[
              "w-full h-12 rounded-full text-white font-medium transition shadow-md",
              submitting
                ? "bg-[#e13429]/60 cursor-not-allowed"
                : "bg-[#e13429] hover:bg-[#c62d23]",
            ].join(" ")}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Note: Please ensure uploaded documents are readable (PDF/Image).
          </p>
        </div>
      </form>
    </div>
  );
};

export default NonProfitRegister;