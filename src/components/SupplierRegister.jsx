import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { BASE_URL } from "../utils/constants";

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
/* ---- Tiny UI helpers (keep code lean) ---- */
const CL = {
  input:
    "w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white",
  label: "block text-sm font-semibold text-gray-900 mb-1",
  card: "bg-white p-6 rounded-xl shadow mb-6",
  h3: "text-lg font-bold text-gray-900 mb-3",
  file:
    "block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none " +
    "file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700",
};
const Section = ({ title, children }) => (
  <section className={CL.card}>
    <h3 className={CL.h3}>{title}</h3>
    <div className="space-y-3">{children}</div>
  </section>
);
const TextField = ({ label, value, onChange, textarea = false, rows = 3, ...rest }) => (
  <div>
    <label className={CL.label}>{label}</label>
    {textarea ? (
      <textarea className={CL.input} rows={rows} value={value} onChange={onChange} {...rest} />
    ) : (
      <input className={CL.input} value={value} onChange={onChange} {...rest} />
    )}
  </div>
);
const FileInput = ({ label, onChange, accept }) => (
  <div>
    <label className={CL.label}>{label}</label>
    <input type="file" accept={accept} onChange={onChange} className={CL.file} />
  </div>
);
const CheckboxGroup = ({ options, value, onChange }) => {
  const toggle = (opt) => onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
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
      Website / Social Links <span className="text-xs text-gray-600">(https:// required)</span>
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

/* ---- Main Component ---- */
const SupplierRegister = () => {
  // Section 1
  const [businessName, setBusinessName] = useState("");
  const [businessStructure, setBusinessStructure] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [taxID, setTaxID] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [supplierCategory, setSupplierCategory] = useState([]); // array of strings

  // Section 3 (brand/legal)
  const [businessLicense, setBusinessLicense] = useState(null);
  const [w9, setW9] = useState(null);
  const [supplierDiversityStatus, setSupplierDiversityStatus] = useState(null);

  // Section 4 (membership)
  const [membership, setMembership] = useState([]);

  // Section 5 (service overview files)
  const [productCatalog, setProductCatalog] = useState(null);
  const [pricingTiers, setPricingTiers] = useState(null);
  const [MOQ, setMOQ] = useState(null);
  const [warranty, setWarranty] = useState(null);
  const [distributorAgreements, setDistributorAgreements] = useState(null);

  // Section 6 (alignment)
  const [wellness, setWellness] = useState("");
  const [interest, setInterest] = useState("");
  const [nonProfitInterest, setNonProfitInterest] = useState("");

  // Section 7 (agreements)
  const [agreements, setAgreements] = useState({
    communityImpactRebate: false,
    performanceAccountability: false,
    medwellPatnership: false, // matches schema field
    assetsSupply: false,
    membershipRevokeAcknowledgement: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---- validation ---- */
  const validate = () => {
    // URLs
    const links = socialLinks.map((s) => s.trim()).filter(Boolean);
    if (links.some((u) => !validator.isURL(u, { require_protocol: true }))) {
      return "All social links must be valid URLs with protocol (https://...)";
    }
    // Tax ID simple pattern NN-NNNNNNN
    if (taxID && !/^\d{2}-\d{7}$/.test(taxID)) {
      return "Tax ID must match NN-NNNNNNN format.";
    }
    // Membership ≥ 5
    if (membership.length < 5) {
      return "Please select at least 5 participation activities.";
    }
    // Agreements all true
    if (!Object.values(agreements).every(Boolean)) {
      return "Please accept all agreement checkboxes.";
    }
    return null;
  };

  /* ---- submit ---- */
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
      fd.append("businessName", businessName);
      fd.append("businessStructure", businessStructure);
      fd.append("contactName", contactName);
      fd.append("phone", phone);
      fd.append("taxID", taxID);
      fd.append("socialLinks", JSON.stringify(socialLinks.map((s) => s.trim()).filter(Boolean)));
      fd.append("supplierCategory", JSON.stringify(supplierCategory));

      // Section 3 (brand/legal)
      if (businessLicense) fd.append("businessLicense", businessLicense);
      if (w9) fd.append("w9", w9);
      if (supplierDiversityStatus) fd.append("supplierDiversityStatus", supplierDiversityStatus);

      // Section 4 (membership)
      fd.append("MembershipParticipation", JSON.stringify(membership));

      // Section 5 (service overview)
      if (productCatalog) fd.append("productCatalog", productCatalog);
      if (pricingTiers) fd.append("pricingTiers", pricingTiers);
      if (MOQ) fd.append("MOQ", MOQ);
      if (warranty) fd.append("warranty", warranty);
      if (distributorAgreements) fd.append("distributorAgreements", distributorAgreements);

      // Section 6 (alignment)
      fd.append("wellness", wellness);
      fd.append("interest", interest);
      fd.append("nonProfitInterest", nonProfitInterest);

      // Section 7 (agreements)
      Object.entries(agreements).forEach(([k, v]) => fd.append(k, v));

      await axios.post(`${BASE_URL}/supplier/vetting`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSuccess("Supplier details submitted successfully!");
    } catch {
      setError("Submission failed. Please check your input.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-xl shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Supplier Registration</h2>

      {/* Section 1: Company Info */}
      <Section title="Section 1: Company Information">
        <TextField label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">Business Structure</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={businessStructure}
            onChange={(e) => setBusinessStructure(e.target.value)}
            required
          >
            <option value="">Select structure</option>
            {BUSINESS_STRUCTURES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <TextField label="Primary Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
        <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField label="Tax ID (NN-NNNNNNN)" value={taxID} onChange={(e) => setTaxID(e.target.value)} />
        <SocialLinks links={socialLinks} setLinks={setSocialLinks} />
         <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Supplier Category (choose one or more)
          </label>
          <div className="space-y-2">
            {SUPPLIER_CATEGORIES.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-gray-900">
                <input
                  type="checkbox"
                  className="accent-blue-600"
                  checked={supplierCategory.includes(opt)}
                  onChange={() =>
                    setSupplierCategory((prev) =>
                      prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]
                    )
                  }
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

      </Section>

      {/* Section 3: Brand & Legal */}
      <Section title="Section 3: Brand Guidelines & Legal">
        <FileInput label="Business License (PDF)" accept="application/pdf" onChange={(e) => setBusinessLicense(e.target.files[0])} />
        <FileInput label="W-9 (PDF)" accept="application/pdf" onChange={(e) => setW9(e.target.files[0])} />
        <FileInput label="Supplier Diversity Status (PDF)" accept="application/pdf" onChange={(e) => setSupplierDiversityStatus(e.target.files[0])} />
      </Section>

      {/* Section 4: Membership Participation */}
      <Section title="Section 4: Membership Participation (Select at least 5)">
        <CheckboxGroup options={MEMBERSHIP_OPTIONS} value={membership} onChange={setMembership} />
        <div className="text-xs text-gray-600">Selected: {membership.length}/5</div>
      </Section>

      {/* Section 5: Product & Service Overview */}
      <Section title="Section 5: Product & Service Overview (PDFs)">
        <FileInput label="Product Catalog" accept="application/pdf" onChange={(e) => setProductCatalog(e.target.files[0])} />
        <FileInput label="Pricing Tiers / Discount Programs" accept="application/pdf" onChange={(e) => setPricingTiers(e.target.files[0])} />
        <FileInput label="MOQ (Minimum Order Quantities)" accept="application/pdf" onChange={(e) => setMOQ(e.target.files[0])} />
        <FileInput label="Warranty / Return Policy" accept="application/pdf" onChange={(e) => setWarranty(e.target.files[0])} />
        <FileInput label="Distributor Agreements" accept="application/pdf" onChange={(e) => setDistributorAgreements(e.target.files[0])} />
      </Section>

      {/* Section 6: Alignment & Mission Fit */}
      <Section title="Section 6: Alignment & Mission Fit">
        <TextField textarea label="How do your products/services support health outcomes?" value={wellness} onChange={(e) => setWellness(e.target.value)} />
        <TextField textarea label="Why are you interested in joining Assign It Forward?" value={interest} onChange={(e) => setInterest(e.target.value)} />
        <TextField textarea label="Causes or nonprofit areas you'd like to support" value={nonProfitInterest} onChange={(e) => setNonProfitInterest(e.target.value)} />
      </Section>

      {/* Section 7: Agreement & Activation */}
      <Section title="Section 7: Agreement & Activation">
        {Object.entries({
          communityImpactRebate: "Agree to community impact rebate (baseline 3%)",
          performanceAccountability: "Understand participation requires ongoing performance accountability",
          medwellPatnership: "Approve Medwell to list company as a supplier",
          assetsSupply: "Willing to provide marketing assets (logos, product photos, brochures)",
          membershipRevokeAcknowledgement: "Acknowledge membership may be revoked if inactive or non-compliant",
        }).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-gray-900">
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
        className={`w-full py-3 rounded-md font-semibold text-white ${
          submitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default SupplierRegister;
