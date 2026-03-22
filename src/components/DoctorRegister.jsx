import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/s3Upload";

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

/* ---------- UI helpers (Medwell white + red) ---------- */

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-3xl shadow-xl ${className}`}>
    {children}
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Label = ({ children }) => (
  <span className="block text-sm font-semibold text-gray-700 mb-1">
    {children}
  </span>
);

const Input = (props) => (
  <input
    {...props}
    className={[
      "w-full border border-gray-200 rounded-xl px-4 h-11",
      "bg-white",
      "focus:outline-none focus:ring-2 focus:ring-[#e13429]/30",
      props.className || "",
    ].join(" ")}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    className={[
      "w-full border border-gray-200 rounded-xl px-4 py-3",
      "bg-white",
      "focus:outline-none focus:ring-2 focus:ring-[#e13429]/30",
      props.className || "",
    ].join(" ")}
  />
);

const FileInput = ({ label, accept, onChange }) => (
  <div>
    <Label>{label}</Label>
    <input
      type="file"
      accept={accept}
      onChange={onChange}
      className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
    />
  </div>
);

const TextField = ({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  placeholder = "",
  required = false,
}) => (
  <div>
    <Label>
      {label}
      {required && <span className="ml-0.5 text-[#e13429]">*</span>}
    </Label>
    {textarea ? (
      <TextArea
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ) : (
      <Input value={value} onChange={onChange} placeholder={placeholder} />
    )}
  </div>
);

const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (opt) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#e13429]"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span className="text-gray-800">{opt}</span>
        </label>
      ))}
    </div>
  );
};

const Alert = ({ type = "error", children }) => {
  const styles =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
};

const PrimaryButton = ({ children, disabled, ...rest }) => (
  <button
    {...rest}
    disabled={disabled}
    className={[
      "w-full h-12 rounded-full font-medium text-white",
      "bg-[#e13429] hover:bg-[#c62d23] transition shadow-md",
      disabled ? "opacity-60 cursor-not-allowed hover:bg-[#e13429]" : "",
    ].join(" ")}
  >
    {children}
  </button>
);

const GhostIconButton = ({ children, ...rest }) => (
  <button
    {...rest}
    type="button"
    className="h-11 w-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition inline-flex items-center justify-center"
  >
    {children}
  </button>
);

const LinkButton = ({ children, ...rest }) => (
  <button
    {...rest}
    type="button"
    className="text-sm font-medium text-[#e13429] hover:text-[#c62d23] transition"
  >
    {children}
  </button>
);

const SocialLinks = ({ links, setLinks }) => (
  <div>
    <Label>
      Social Links{" "}
      <span className="text-xs font-normal text-gray-500">(https:// required)</span>
    </Label>

    {links.map((l, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <Input
          placeholder="https://example.com"
          value={l}
          onChange={(e) => {
            const next = [...links];
            next[i] = e.target.value;
            setLinks(next);
          }}
        />
        {links.length > 1 && (
          <GhostIconButton onClick={() => setLinks(links.filter((_, x) => x !== i))}>
            ✕
          </GhostIconButton>
        )}
      </div>
    ))}

    <LinkButton onClick={() => setLinks([...links, ""])}>+ Add another link</LinkButton>
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
    if (!hipaaAcknowledged) return "Please acknowledge HIPAA before submitting.";
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
      const [businessLicenseUrl, w9Url, logoUrl, headshotUrl] = await Promise.all([
        businessLicense ? uploadFileToS3(businessLicense) : Promise.resolve(""),
        w9 ? uploadFileToS3(w9) : Promise.resolve(""),
        logo ? uploadFileToS3(logo) : Promise.resolve(""),
        headshot ? uploadFileToS3(headshot) : Promise.resolve(""),
      ]);

      let finalCampaignFit = [...campaignFit];
      if (customCampaignFit.trim()) {
        finalCampaignFit = [
          ...finalCampaignFit,
          ...customCampaignFit.split(",").map((s) => s.trim()).filter(Boolean),
        ];
      }

      await axios.post(
        `${BASE_URL}/doctor/vetting`,
        {
          clinicName,
          practiceAddress,
          website,
          socialLinks: socialLinks.map((s) => s.trim()).filter(Boolean),
          businessLicenseUrl,
          w9Url,
          logoUrl,
          headshotUrl,
          hipaaAcknowledged,
          participationOptions,
          promoteEngagement,
          meaningfulCauses,
          campaignFit: finalCampaignFit,
        },
        { withCredentials: true }
      );

      setSuccess("Doctor details submitted successfully!");
    } catch (e2) {
      console.error(e2);
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
      <form onSubmit={submit} className="max-w-3xl mx-auto">
        <Card className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Doctor Registration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Provide clinic details and select how you want to participate.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Fields marked <span className="text-[#e13429] font-bold">*</span> are required
            </p>
          </div>

          <div className="space-y-6">
            {/* Section 1 */}
            <Section title="Section 1: Clinic Information">
              <TextField
                label="Clinic Name"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Clinic / Practice name"
                required
              />
              <TextField
                label="Practice Address"
                value={practiceAddress}
                onChange={(e) => setPracticeAddress(e.target.value)}
                placeholder="Street, City, State"
                required
              />
              <TextField
                label="Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourclinic.com"
              />
              <SocialLinks links={socialLinks} setLinks={setSocialLinks} />
            </Section>

            {/* Section 2 */}
            <Section title="Section 2: Compliance & Branding">
              <FileInput
                label="Business License (PDF/Image)"
                accept="application/pdf,image/*"
                onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)}
              />
              <FileInput
                label="W-9 (PDF/Image)"
                accept="application/pdf,image/*"
                onChange={(e) => setW9(e.target.files?.[0] || null)}
              />
              <FileInput
                label="Logo (Image)"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files?.[0] || null)}
              />
              <FileInput
                label="Headshot (Image)"
                accept="image/*"
                onChange={(e) => setHeadshot(e.target.files?.[0] || null)}
              />

              <label className="flex items-center gap-3 text-sm mt-2 text-gray-800">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#e13429]"
                  checked={hipaaAcknowledged}
                  onChange={() => setHipaaAcknowledged((v) => !v)}
                />
                <span className="font-medium">
                  HIPAA Acknowledged <span className="text-[#e13429]">*</span>
                </span>
              </label>
            </Section>

            {/* Section 3 */}
            <Section title="Section 3: Participation Options (Select at least 5) *">
              <CheckboxGroup
                options={DOCTOR_PARTICIPATION_OPTIONS}
                value={participationOptions}
                onChange={setParticipationOptions}
              />
              <div className="text-xs text-gray-500">
                Selected: {participationOptions.length}/5
              </div>
            </Section>

            {/* Section 4 */}
            <Section title="Section 4: Alignment & Causes">
              <TextField
                label="How do you currently promote patient engagement or wellness?"
                value={promoteEngagement}
                onChange={(e) => setPromoteEngagement(e.target.value)}
                textarea
                rows={4}
                placeholder="Describe your approach…"
              />
              <TextField
                label="What causes or community populations are most meaningful to your practice?"
                value={meaningfulCauses}
                onChange={(e) => setMeaningfulCauses(e.target.value)}
                textarea
                rows={4}
                placeholder="Examples: veterans, diabetes prevention, mental health…"
              />
            </Section>

            {/* Section 5 */}
            <Section title="Section 5: Campaign Fit">
              <CheckboxGroup
                options={CAMPAIGN_FIT_OPTIONS}
                value={campaignFit}
                onChange={setCampaignFit}
              />

              <div className="mt-3">
                <Label>
                  Custom cause(s){" "}
                  <span className="text-xs font-normal text-gray-500">
                    (comma separated)
                  </span>
                </Label>
                <Input
                  placeholder="e.g., blood donation, tobacco cessation"
                  value={customCampaignFit}
                  onChange={(e) => setCustomCampaignFit(e.target.value)}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Select or add at least one.
                </p>
              </div>
            </Section>

            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            <PrimaryButton type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </PrimaryButton>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default DoctorRegister;