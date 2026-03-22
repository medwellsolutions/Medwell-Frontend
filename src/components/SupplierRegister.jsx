import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";
import { uploadFileToS3 } from "../utils/s3Upload";

/* ---- Options ---- */
const MEMBERSHIP_OPTIONS = [
  "Agree to contribute a % community impact fee (donations toward nonprofits)",
  "Provide transparent pricing and competitive bids via Medwell’s platform",
  "Offer volume or performance-based rebate structures",
  "Participate in co-branded marketing campaigns (flyers, livestreams, cause activations)",
  "Sponsor or match donations for monthly awareness campaigns",
  "Submit product education materials for workshops or student learning",
  "Provide quarterly sales/performance reports for impact tracking",
  "Join at least one cause-related initiative (e.g., Autism, Breast Cancer) annually",
];

const SUPPLIER_CATEGORIES = [
  "Pharmaceuticals",
  "Medical Devices",
  "Diagnostics",
  "Wellness",
  "Nutrition",
  "HealthTech",
  "Services",
  "Other",
];

const BUSINESS_STRUCTURES = [
  "LLC",
  "C-Corp",
  "S-Corp",
  "Sole Proprietor",
  "Partnership",
  "Nonprofit",
  "Other",
];

/* =========================================================
   Medwell Theme (keep 2/3/4):
   - Peach/orange gradient + friendly pastel vibe
   - Rounded white cards with gentle shadow
   - Soft gray borders
   - Primary button: #e13429
   ========================================================= */
const MW = {
  page: "min-h-screen px-4 py-10 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50",
  wrap: "max-w-3xl mx-auto",
  card:
    "bg-white/90 backdrop-blur rounded-3xl border border-slate-200/80 shadow-[0_12px_32px_rgba(15,23,42,0.10)] overflow-hidden",
  header: "px-6 sm:px-8 py-7 border-b border-slate-200/70",
  title: "text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 text-center",
  sub: "mt-2 text-slate-600 text-sm sm:text-base text-center",

  section: "bg-white/90 backdrop-blur rounded-3xl border border-slate-200/80 shadow-[0_10px_26px_rgba(15,23,42,0.08)] p-6 sm:p-7",
  sectionTitle: "text-xl font-extrabold text-slate-900",
  sectionHint: "text-sm text-slate-600",

  // playful but restrained frame
  frameWrap: "relative",
  frameA: "absolute -inset-2 rounded-3xl border border-white/40",
  frameB: "absolute -inset-2 rounded-3xl border border-[#e13429]/20",

  label: "block text-sm font-semibold text-slate-900 mb-1.5",
  hint: "text-xs text-slate-500",
  input:
    "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/35",
  textarea:
    "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/35",
  select:
    "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 " +
    "focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/35",

  file:
    "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 cursor-pointer " +
    "file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 " +
    "hover:file:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/35",

  checkboxRow:
    "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50 transition",
  checkbox:
    "mt-1 h-5 w-5 rounded-md border-slate-300 text-[#e13429] focus:ring-[#e13429]/30",
  checkboxText: "text-sm text-slate-700",

  linkBtn:
    "text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30",

  btn:
    "w-full py-3 rounded-full font-extrabold text-white bg-[#e13429] hover:bg-[#c92d25] active:bg-[#b82620] " +
    "transition disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#e13429]/35",

  alertErr:
    "rounded-2xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm font-semibold",
  alertOk:
    "rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-3 text-sm font-semibold",
};

/* ---- UI Components ---- */
const Section = ({ title, subtitle, children, rotate = "-0.6deg" }) => (
  <section className={MW.frameWrap}>
    <div className={MW.frameA} style={{ transform: `rotate(${rotate})` }} />
    <div
      className={MW.frameB}
      style={{
        transform: `rotate(${rotate}) translateX(2px) translateY(2px)`,
      }}
    />
    <div className="relative">
      <div className={MW.section}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className={MW.sectionTitle}>{title}</h3>
            {subtitle && <p className={`${MW.sectionHint} mt-1`}>{subtitle}</p>}
          </div>
        </div>
        <div className="mt-5 space-y-4">{children}</div>
      </div>
    </div>
  </section>
);

const TextField = ({
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  required = false,
  ...rest
}) => (
  <div>
    <label className={MW.label}>
      {label}
      {required && <span className="ml-0.5 text-[#e13429]">*</span>}
    </label>
    {textarea ? (
      <textarea
        className={MW.textarea}
        rows={rows}
        value={value}
        onChange={onChange}
        {...rest}
      />
    ) : (
      <input className={MW.input} value={value} onChange={onChange} {...rest} />
    )}
  </div>
);

const FileInput = ({ label, onChange, accept, helper }) => (
  <div>
    <label className={MW.label}>{label}</label>
    <input type="file" accept={accept} onChange={onChange} className={MW.file} />
    {helper ? <div className={`mt-1 ${MW.hint}`}>{helper}</div> : null}
  </div>
);

const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (opt) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);

  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className={MW.checkboxRow}>
          <input
            type="checkbox"
            className={MW.checkbox}
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span className={MW.checkboxText}>{opt}</span>
        </label>
      ))}
    </div>
  );
};

const SocialLinks = ({ links, setLinks }) => (
  <div>
    <label className={MW.label}>
      Website / Social Links{" "}
      <span className={MW.hint}>(https:// required)</span>
    </label>

    {links.map((l, i) => (
      <div key={i} className="flex gap-2 mb-2">
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
            className="shrink-0 px-3 rounded-full border border-slate-200 text-rose-600 font-bold hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
            onClick={() => setLinks(links.filter((_, x) => x !== i))}
            aria-label="Remove link"
          >
            ×
          </button>
        )}
      </div>
    ))}

    <button type="button" className={MW.linkBtn} onClick={() => setLinks([...links, ""])}>
      + Add another link
    </button>
  </div>
);

/* ---- Main Component ---- */
const SupplierRegister = () => {
  // Section 1
  const [businessName, setBusinessName] = useState("");
  const [businessStructure, setBusinessStructure] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [taxID, setTaxID] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [supplierCategory, setSupplierCategory] = useState([]);

  // Section 2 (brand/legal)
  const [businessLicense, setBusinessLicense] = useState(null);
  const [w9, setW9] = useState(null);
  const [supplierDiversityStatus, setSupplierDiversityStatus] = useState(null);

  // Section 3 (membership)
  const [membership, setMembership] = useState([]);

  // Section 4 (service overview)
  const [productCatalog, setProductCatalog] = useState(null);
  const [pricingTiers, setPricingTiers] = useState(null);
  const [MOQ, setMOQ] = useState(null);
  const [warranty, setWarranty] = useState(null);
  const [distributorAgreements, setDistributorAgreements] = useState(null);

  // Section 5 (alignment)
  const [wellness, setWellness] = useState("");
  const [interest, setInterest] = useState("");
  const [nonProfitInterest, setNonProfitInterest] = useState("");

  // Section 6 (agreements)
  const [agreements, setAgreements] = useState({
    communityImpactRebate: false,
    performanceAccountability: false,
    medwellPatnership: false, // keep schema spelling
    assetsSupply: false,
    membershipRevokeAcknowledgement: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    const links = socialLinks.map((s) => s.trim()).filter(Boolean);
    if (links.some((u) => !validator.isURL(u, { require_protocol: true }))) {
      return "All social links must be valid URLs with protocol (https://...)";
    }
    if (taxID && !/^\d{2}-\d{7}$/.test(taxID)) {
      return "Tax ID must match NN-NNNNNNN format.";
    }
    if (membership.length < 5) {
      return "Please select at least 5 participation activities.";
    }
    if (!Object.values(agreements).every(Boolean)) {
      return "Please accept all agreement checkboxes.";
    }
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

      // --- Upload files to S3, get back URLs ---
      const [
        businessLicenseUrl,
        w9Url,
        supplierDiversityStatusUrl,
        productCatalogUrl,
        pricingTiersUrl,
        MOQUrl,
        warrantyUrl,
        distributorAgreementsUrl,
      ] = await Promise.all([
        businessLicense ? uploadFileToS3(businessLicense) : Promise.resolve(""),
        w9 ? uploadFileToS3(w9) : Promise.resolve(""),
        supplierDiversityStatus ? uploadFileToS3(supplierDiversityStatus) : Promise.resolve(""),
        productCatalog ? uploadFileToS3(productCatalog) : Promise.resolve(""),
        pricingTiers ? uploadFileToS3(pricingTiers) : Promise.resolve(""),
        MOQ ? uploadFileToS3(MOQ) : Promise.resolve(""),
        warranty ? uploadFileToS3(warranty) : Promise.resolve(""),
        distributorAgreements ? uploadFileToS3(distributorAgreements) : Promise.resolve(""),
      ]);

      // --- Send JSON payload to backend ---
      await axios.post(
        `${BASE_URL}/supplier/vetting`,
        {
          businessName,
          businessStructure,
          contactName,
          phone,
          taxID,
          socialLinks: socialLinks.map((s) => s.trim()).filter(Boolean),
          supplierCategory,

          businessLicenseUrl,
          w9Url,
          supplierDiversityStatusUrl,

          MembershipParticipation: membership,

          productCatalogUrl,
          pricingTiersUrl,
          MOQUrl,
          warrantyUrl,
          distributorAgreementsUrl,

          wellness,
          interest,
          nonProfitInterest,

          ...agreements,
        },
        { withCredentials: true }
      );

      setSuccess("Supplier details submitted successfully!");
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
    <div className={MW.page}>
      <div className={MW.wrap}>
        <div className={MW.card}>
          {/* Header */}
          <div className={MW.header}>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-100">
                  Supplier
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-100">
                  Network
                </span>
              </div>
              <h2 className={MW.title}>Supplier Registration</h2>
              <p className={MW.sub}>
                Join Medwell’s supplier network and support verified community impact.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Fields marked <span className="text-[#e13429] font-bold">*</span> are required
              </p>
            </div>
          </div>

          <form onSubmit={submit} className="px-6 sm:px-8 py-8">
            <div className="space-y-6">
              {/* Section 1 */}
              <Section
                title="Section 1: Company Information"
                subtitle="Basic details about your business."
                rotate="-0.6deg"
              >
                <TextField
                  label="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />

                <div>
                  <label className={MW.label}>
                    Business Structure
                    <span className="ml-0.5 text-[#e13429]">*</span>
                  </label>
                  <select
                    className={MW.select}
                    value={businessStructure}
                    onChange={(e) => setBusinessStructure(e.target.value)}
                    required
                  >
                    <option value="">Select structure</option>
                    {BUSINESS_STRUCTURES.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <TextField
                  label="Primary Contact Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <TextField
                  label="Tax ID (NN-NNNNNNN)"
                  value={taxID}
                  onChange={(e) => setTaxID(e.target.value)}
                  placeholder="12-3456789"
                />

                <SocialLinks links={socialLinks} setLinks={setSocialLinks} />

                <div>
                  <label className={MW.label}>
                    Supplier Category <span className={MW.hint}>(choose one or more)</span>
                  </label>
                  <div className="space-y-2">
                    {SUPPLIER_CATEGORIES.map((opt) => (
                      <label key={opt} className={MW.checkboxRow}>
                        <input
                          type="checkbox"
                          className={MW.checkbox}
                          checked={supplierCategory.includes(opt)}
                          onChange={() =>
                            setSupplierCategory((prev) =>
                              prev.includes(opt)
                                ? prev.filter((v) => v !== opt)
                                : [...prev, opt]
                            )
                          }
                        />
                        <span className={MW.checkboxText}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Section 2 */}
              <Section
                title="Section 2: Brand Guidelines & Legal"
                subtitle="Upload required verification documents."
                rotate="0.6deg"
              >
                <FileInput
                  label="Business License (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setBusinessLicense(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="W-9 (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setW9(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="Supplier Diversity Status (PDF)"
                  accept="application/pdf"
                  onChange={(e) =>
                    setSupplierDiversityStatus(e.target.files?.[0] || null)
                  }
                />
              </Section>

              {/* Section 3 */}
              <Section
                title="Section 3: Membership Participation"
                subtitle="Select at least 5."
                rotate="-0.6deg"
              >
                <CheckboxGroup
                  options={MEMBERSHIP_OPTIONS}
                  value={membership}
                  onChange={setMembership}
                />
                <div className="text-xs text-slate-500">
                  Selected: <span className="font-semibold">{membership.length}</span>/5
                </div>
              </Section>

              {/* Section 4 */}
              <Section
                title="Section 4: Product & Service Overview"
                subtitle="PDFs are preferred."
                rotate="0.6deg"
              >
                <FileInput
                  label="Product Catalog (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setProductCatalog(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="Pricing Tiers / Discount Programs (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setPricingTiers(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="MOQ (Minimum Order Quantities) (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setMOQ(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="Warranty / Return Policy (PDF)"
                  accept="application/pdf"
                  onChange={(e) => setWarranty(e.target.files?.[0] || null)}
                />
                <FileInput
                  label="Distributor Agreements (PDF)"
                  accept="application/pdf"
                  onChange={(e) =>
                    setDistributorAgreements(e.target.files?.[0] || null)
                  }
                />
              </Section>

              {/* Section 5 */}
              <Section
                title="Section 5: Alignment & Mission Fit"
                subtitle="Tell us how you support better health outcomes."
                rotate="-0.6deg"
              >
                <TextField
                  textarea
                  label="How do your products/services support health outcomes?"
                  value={wellness}
                  onChange={(e) => setWellness(e.target.value)}
                />
                <TextField
                  textarea
                  label="Why are you interested in joining Assign It Forward?"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />
                <TextField
                  textarea
                  label="Causes or nonprofit areas you'd like to support"
                  value={nonProfitInterest}
                  onChange={(e) => setNonProfitInterest(e.target.value)}
                />
              </Section>

              {/* Section 6 */}
              <Section
                title="Section 6: Agreement & Activation"
                subtitle="All required to proceed."
                rotate="0.6deg"
              >
                {Object.entries({
                  communityImpactRebate:
                    "Agree to community impact rebate (baseline 3%)",
                  performanceAccountability:
                    "Understand participation requires ongoing performance accountability",
                  medwellPatnership:
                    "Approve Medwell to list company as a supplier",
                  assetsSupply:
                    "Willing to provide marketing assets (logos, product photos, brochures)",
                  membershipRevokeAcknowledgement:
                    "Acknowledge membership may be revoked if inactive or non-compliant",
                }).map(([key, label]) => (
                  <label key={key} className={MW.checkboxRow}>
                    <input
                      type="checkbox"
                      className={MW.checkbox}
                      checked={agreements[key]}
                      onChange={() =>
                        setAgreements((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }))
                      }
                    />
                    <span className={MW.checkboxText}>{label}</span>
                  </label>
                ))}
              </Section>

              {/* Alerts */}
              {error && <div className={MW.alertErr}>{error}</div>}
              {success && <div className={MW.alertOk}>{success}</div>}

              {/* Submit */}
              <button type="submit" disabled={submitting} className={MW.btn}>
                {submitting ? "Submitting..." : "Submit"}
              </button>

              <p className="text-center text-xs text-slate-500">
                Primary action color is <span className="font-semibold">#e13429</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegister;