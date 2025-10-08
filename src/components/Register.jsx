import React, { useState } from "react";
import validator from "validator";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Register = () => {
  const [clinicName, setClinicName] = useState("clinicName");
  const [practiceAddress, setPracticeAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [businessLicense, setBusinessLicense] = useState(null);
  const [w9, setW9] = useState(null);
  const [logo, setLogo] = useState(null);
  const [headshot, setHeadshot] = useState(null);
  const [hipaaAcknowledged, setHipaaAcknowledged] = useState(false);
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
  const [participationOptions, setParticipationOptions] = useState([]);
  const [promoteEngagement, setPromoteEngagement] = useState("");
  const [meaningfulCauses, setMeaningfulCauses] = useState("");
  const CAMPAIGN_FIT_OPTIONS = [
    "Mental Health / Stress Awareness",
    "Autism & Neurodiversity",
    "Breast Cancer / Prostate Cancer",
    "Veterans & First Responders",
    "Preventive Screenings (Diabetes, Cervical, Mammogram)",
    "Healthy Vision, Sleep, or Heart Health",
    "Adolescent & College Health",
    "Nutrition & Obesity Prevention",
    "Chronic Care Management"
  ];
  const [campaignFit, setCampaignFit] = useState([]);
  const [customCampaignFit, setCustomCampaignFit] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("clinicName", clinicName);
      formData.append("practiceAddress", practiceAddress);
      formData.append("website", website);
      // Validate socialLinks as array of valid URLs
      const validLinks = socialLinks.filter(link => link.trim() !== "");
      if (validLinks.some(link => !validator.isURL(link, { require_protocol: true }))) {
        setError("All social links must be valid URLs with protocol (e.g. https://...) ");
        return;
      }
      formData.append("socialLinks", JSON.stringify(validLinks));
      formData.append("businessLicense", businessLicense);
      formData.append("w9", w9);
      formData.append("logo", logo);
      formData.append("headshot", headshot);
      formData.append("hipaaAcknowledged", hipaaAcknowledged);
      // Validate participationOptions (at least 5)
      if (participationOptions.length < 5) {
        setError("Please select at least 5 participation activities.");
        return;
      }
      formData.append("participationOptions", JSON.stringify(participationOptions));
      formData.append("promoteEngagement", promoteEngagement);
      formData.append("meaningfulCauses", meaningfulCauses);
      // Combine selected and custom campaign fit options
      let campaignFitArr = [...campaignFit];
      if (customCampaignFit.trim()) {
        campaignFitArr = [...campaignFitArr, ...customCampaignFit.split(",").map(s => s.trim()).filter(Boolean)];
      }
      if (campaignFitArr.length === 0) {
        setError("Please select or enter at least one campaign fit.");
        return;
      }
      formData.append("campaignFit", JSON.stringify(campaignFitArr));

      await axios.post(BASE_URL+"/doctor/vetting", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setSuccess("Details submitted successfully!");
    } catch (err) {
      setError("Submission failed. Please check your input.");
    }
  };

  return (
    <form
      className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-10"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Doctor Details</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Clinic Name</label>
        <input
          className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Practice Address</label>
        <input
          className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          value={practiceAddress}
          onChange={(e) => setPracticeAddress(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700  font-semibold mb-1">Website</label>
        <input
          className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Social Links <span className="text-xs text-gray-400">(Add one or more URLs with protocol)</span></label>
        {socialLinks.map((link, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              value={link}
              onChange={e => {
                const newLinks = [...socialLinks];
                newLinks[idx] = e.target.value;
                setSocialLinks(newLinks);
              }}
              placeholder="https://example.com"
            />
            {socialLinks.length > 1 && (
              <button type="button" className="text-red-500 font-bold px-2" onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== idx))}>×</button>
            )}
          </div>
        ))}
        <button type="button" className="text-blue-600 underline text-sm" onClick={() => setSocialLinks([...socialLinks, ""])}>+ Add another link</button>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Business License (PDF/Image)</label>
          {/* <input type="file" accept="image/*,application/pdf" onChange={handleFileChange(setBusinessLicense)} className="block w-full text-sm text-gray-600" /> */}
          <input type="file" className="file-input" accept="image/*,application/pdf" onChange={handleFileChange(setBusinessLicense)} />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">W9 (PDF/Image)</label>
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange(setW9)} className="block w-full text-sm text-gray-600" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Logo (Image)</label>
          <input type="file" accept="image/*" onChange={handleFileChange(setLogo)} className="block w-full text-sm text-gray-600" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Headshot (Image)</label>
          <input type="file" accept="image/*" onChange={handleFileChange(setHeadshot)} className="block w-full text-sm text-gray-600" />
        </div>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={hipaaAcknowledged}
          onChange={(e) => setHipaaAcknowledged(e.target.checked)}
          className="mr-2"
        />
        <label className="text-gray-700 font-semibold">HIPAA Acknowledged</label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Participation Options <span className="text-xs text-gray-400">(Select at least 5)</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DOCTOR_PARTICIPATION_OPTIONS.map(option => (
            <label key={option} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded p-2 cursor-pointer hover:bg-blue-50 transition">
              <input
                type="checkbox"
                value={option}
                checked={participationOptions.includes(option)}
                onChange={e => {
                  if (e.target.checked) {
                    setParticipationOptions([...participationOptions, option]);
                  } else {
                    setParticipationOptions(participationOptions.filter(o => o !== option));
                  }
                }}
                className="mt-1 accent-blue-600"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-1">Select at least 5 activities.</div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">How do you currently promote patient engagement or wellness?</label>
        <input
          className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          value={promoteEngagement}
          onChange={(e) => setPromoteEngagement(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">What causes or community populations are most meaningful to your practice? </label>
        <input
          className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          value={meaningfulCauses}
          onChange={(e) => setMeaningfulCauses(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">Campaign Fit <span className="text-xs text-gray-400">(Select one or more, or add your own)</span></label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          {CAMPAIGN_FIT_OPTIONS.map(option => (
            <label key={option} className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded p-2 cursor-pointer hover:bg-blue-50 transition">
              <input
                type="checkbox"
                value={option}
                checked={campaignFit.includes(option)}
                onChange={e => {
                  if (e.target.checked) {
                    setCampaignFit([...campaignFit, option]);
                  } else {
                    setCampaignFit(campaignFit.filter(o => o !== option));
                  }
                }}
                className="mt-1 accent-blue-600"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
        <input
          className="w-full mt-2 px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
          type="text"
          placeholder="Add custom cause(s), comma separated"
          value={customCampaignFit}
          onChange={e => setCustomCampaignFit(e.target.value)}
        />
        <div className="text-xs text-gray-500 mt-1">You can also add custom causes separated by commas.</div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Register;