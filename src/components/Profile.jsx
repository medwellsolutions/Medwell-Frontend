import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ALLOWED_FIELDS = [
  "firstName",
  "lastName",
  "location",
  "age",
  "gender",
  "college",
  "clubs",
];

const initialForm = {
  firstName: "",
  lastName: "",
  location: "",
  age: "",
  gender: "",
  college: "",
  clubs: false,
};

const Profile = () => {
  const [data, setData] = useState(null);      // loaded profile
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState(initialForm);

  // Fetch profile
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/profile/me`, { withCredentials: true });
        if (!mounted) return;
        setData(res?.data?.data || null);

        // prime edit form with whatever came back
        const d = res?.data?.data || {};
        setForm((f) => ({
          ...f,
          firstName: d.firstName || "",
          lastName:  d.lastName || "",
          location:  d.location || "",
          age:       d.age ?? "",
          gender:    d.gender || "",
          college:   d.college || "",
          clubs:     Boolean(d.clubs),
        }));
        setErr("");
      } catch (e) {
        setErr(e?.response?.data || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const safePayload = useMemo(() => {
    // Only send whitelisted fields
    const p = {};
    for (const k of ALLOWED_FIELDS) {
      if (k in form && form[k] !== undefined) p[k] = form[k];
    }
    // normalize booleans / numbers
    if (p.age === "" || p.age === null) delete p.age;
    else p.age = Number(p.age);

    p.clubs = Boolean(p.clubs);
    return p;
  }, [form]);

  const onChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async () => {
    try {
      setSaving(true);
      setErr("");
      const res = await axios.patch(`${BASE_URL}/profile/edit`, safePayload, {
        withCredentials: true,
      });
      const updated = res?.data?.data;
      setData(updated);
      // sync form with returned doc
      setForm((f) => ({
        ...f,
        firstName: updated.firstName || "",
        lastName:  updated.lastName || "",
        location:  updated.location || "",
        age:       updated.age ?? "",
        gender:    updated.gender || "",
        college:   updated.college || "",
        clubs:     Boolean(updated.clubs),
      }));
      setOpenEdit(false);
    } catch (e) {
      setErr(e?.response?.data || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="animate-pulse text-neutral-500">Loading profile…</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">{err || "No profile found."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* View card */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Profile</h2>
          <button
            onClick={() => setOpenEdit((v) => !v)}
            className="rounded-md px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {openEdit ? "Close" : "Edit Profile"}
          </button>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <Field label="First Name" value={data.firstName} />
          <Field label="Last Name" value={data.lastName} />
          <Field label="Email" value={data.emailId} />
          <Field label="Phone" value={data.phone} />
          <Field label="Location" value={data.location} />
          <Field label="Role" value={data.role} />
          {data?.status && <Field label="Status" value={data.status} />}
          {data?.age !== undefined && <Field label="Age" value={String(data.age)} />}
          {data?.gender && <Field label="Gender" value={data.gender} />}
          {data?.college && <Field label="College" value={data.college} />}
          {"clubs" in data && <Field label="Clubs" value={data.clubs ? "Yes" : "No"} />}

          <Field
            label="Created"
            value={new Date(data.createdAt).toLocaleString()}
          />
          <Field
            label="Updated"
            value={new Date(data.updatedAt).toLocaleString()}
          />
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="mt-3 text-sm text-red-600">
          {err}
        </div>
      )}

      {/* Edit section (bottom) */}
      {openEdit && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="text-base font-semibold text-neutral-900">
              Edit Profile
            </h3>
            <p className="text-sm text-neutral-500">
              Email, phone, role are not editable.
            </p>
          </div>

          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Editable fields */}
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
            />
            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(e) => onChange("age", e.target.value)}
              min={18}
              max={150}
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => onChange("gender", e.target.value)}
              options={[
                { label: "Select Gender", value: "" },
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Others", value: "others" },
              ]}
            />
            <Input
              label="College"
              value={form.college}
              onChange={(e) => onChange("college", e.target.value)}
            />
            <Toggle
              label="Clubs Member"
              checked={form.clubs}
              onChange={(val) => onChange("clubs", val)}
            />

            {/* Read-only (non-editable) */}
            <Input label="Email" value={data.emailId} disabled />
            <Input label="Phone" value={data.phone} disabled />
            <Input label="Role" value={data.role} disabled />
          </div>

          <div className="px-6 pb-6 flex items-center gap-3 justify-end">
            <button
              onClick={() => {
                // reset form to server values
                const d = data || {};
                setForm({
                  firstName: d.firstName || "",
                  lastName:  d.lastName || "",
                  location:  d.location || "",
                  age:       d.age ?? "",
                  gender:    d.gender || "",
                  college:   d.college || "",
                  clubs:     Boolean(d.clubs),
                });
                setOpenEdit(false);
                setErr("");
              }}
              className="rounded-md px-4 py-2 text-sm font-medium border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="rounded-md px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------
 * Small UI primitives
 * ---------------------*/
const Field = ({ label, value }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
      {label}
    </div>
    <div className="text-sm text-neutral-900 break-words">{value || "—"}</div>
  </div>
);

const Input = ({ label, disabled, ...props }) => (
  <label className="block">
    <span className="block text-sm font-medium text-neutral-700 mb-1">
      {label}
    </span>
    <input
      {...props}
      disabled={disabled}
      className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 ${
        disabled ? "bg-neutral-100 text-neutral-500 border-neutral-200" : "border-neutral-300"
      }`}
    />
  </label>
);

const Select = ({ label, options = [], ...props }) => (
  <label className="block">
    <span className="block text-sm font-medium text-neutral-700 mb-1">
      {label}
    </span>
    <select
      {...props}
      className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-neutral-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-indigo-600" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

export default Profile;
