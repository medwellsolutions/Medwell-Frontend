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

// Medwell primary button (red)
const PrimaryBtn =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-white bg-[#e13429] hover:bg-[#c62d23] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed";

const OutlineBtn =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold border border-slate-300 bg-white hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed";

const GhostBtn =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 transition disabled:opacity-60 disabled:cursor-not-allowed";

const Profile = () => {
  const [data, setData] = useState(null);
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
        const res = await axios.get(`${BASE_URL}/profile/me`, {
          withCredentials: true,
        });

        if (!mounted) return;

        const d = res?.data?.data || null;
        setData(d);

        if (d) {
          setForm({
            firstName: d.firstName || "",
            lastName: d.lastName || "",
            location: d.location || "",
            age: d.age ?? "",
            gender: d.gender || "",
            college: d.college || "",
            clubs: Boolean(d.clubs),
          });
        }

        setErr("");
      } catch (e) {
        setErr(e?.response?.data || "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const safePayload = useMemo(() => {
    const p = {};
    for (const k of ALLOWED_FIELDS) {
      if (k in form && form[k] !== undefined) p[k] = form[k];
    }

    if (p.age === "" || p.age === null) delete p.age;
    else p.age = Number(p.age);

    p.clubs = Boolean(p.clubs);
    return p;
  }, [form]);

  const onChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const onSave = async () => {
    try {
      setSaving(true);
      setErr("");

      const res = await axios.patch(`${BASE_URL}/profile/edit`, safePayload, {
        withCredentials: true,
      });

      const updated = res?.data?.data;
      setData(updated);

      setForm({
        firstName: updated.firstName || "",
        lastName: updated.lastName || "",
        location: updated.location || "",
        age: updated.age ?? "",
        gender: updated.gender || "",
        college: updated.college || "",
        clubs: Boolean(updated.clubs),
      });

      setOpenEdit(false);
    } catch (e) {
      setErr(e?.response?.data || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f8fafc] px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
            <div className="h-6 w-40 rounded bg-slate-100" />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-14 w-full rounded bg-slate-100" />
              <div className="h-14 w-full rounded bg-slate-100" />
              <div className="h-14 w-full rounded bg-slate-100" />
              <div className="h-14 w-full rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[70vh] bg-[#f8fafc] px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {err || "No profile found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* View card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Profile
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                View your details and update editable fields.
              </p>
            </div>

            <button
              onClick={() => setOpenEdit((v) => !v)}
              className={openEdit ? OutlineBtn : PrimaryBtn}
              type="button"
            >
              {openEdit ? "Close" : "Edit Profile"}
            </button>
          </div>

          <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <Field label="First Name" value={data.firstName} />
            <Field label="Last Name" value={data.lastName} />
            <Field label="Email" value={data.emailId} />
            <Field label="Phone" value={data.phone} />
            <Field label="Location" value={data.location} />
            <Field label="Role" value={data.role} />

            {data?.status && <Field label="Status" value={data.status} />}
            {data?.age !== undefined && (
              <Field label="Age" value={String(data.age)} />
            )}
            {data?.gender && <Field label="Gender" value={data.gender} />}
            {data?.college && <Field label="College" value={data.college} />}
            {"clubs" in data && (
              <Field label="Clubs" value={data.clubs ? "Yes" : "No"} />
            )}

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
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {err}
          </div>
        )}

        {/* Edit section */}
        {openEdit && (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">
                Edit Profile
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Email, phone, and role are not editable.
              </p>
            </div>

            <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
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

              {/* Read-only */}
              <Input label="Email" value={data.emailId} disabled />
              <Input label="Phone" value={data.phone} disabled />
              <Input label="Role" value={data.role} disabled />
            </div>

            <div className="px-6 pb-6 flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  const d = data || {};
                  setForm({
                    firstName: d.firstName || "",
                    lastName: d.lastName || "",
                    location: d.location || "",
                    age: d.age ?? "",
                    gender: d.gender || "",
                    college: d.college || "",
                    clubs: Boolean(d.clubs),
                  });
                  setOpenEdit(false);
                  setErr("");
                }}
                className={GhostBtn}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onSave}
                className={PrimaryBtn}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ----------------------
 * Small UI primitives
 * ---------------------*/
const Field = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4">
    <div className="text-xs font-bold uppercase tracking-wide text-slate-700">
      {label}
    </div>
    <div className="mt-1 text-sm text-slate-900 break-words">
      {value || "—"}
    </div>
  </div>
);

const Input = ({ label, disabled, ...props }) => (
  <label className="form-control w-full">
    <div className="label">
      <span className="label-text font-semibold text-slate-800">{label}</span>
    </div>
    <input
      {...props}
      disabled={disabled}
      className={`w-full rounded-2xl border border-slate-200 bg-white px-4 h-11 outline-none focus:ring-2 focus:ring-[#e13429]/25 ${
        disabled ? "opacity-70" : ""
      }`}
    />
  </label>
);

const Select = ({ label, options = [], ...props }) => (
  <label className="form-control w-full">
    <div className="label">
      <span className="label-text font-semibold text-slate-800">{label}</span>
    </div>
    <select
      {...props}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 h-11 outline-none focus:ring-2 focus:ring-[#e13429]/25"
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
  <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4">
    <div className="text-sm font-semibold text-slate-800">{label}</div>
    <input
      type="checkbox"
      className="toggle"
      checked={checked}
      onChange={() => onChange(!checked)}
      style={{
        // keeps daisy toggle but nudges it toward Medwell color
        accentColor: "#e13429",
      }}
    />
  </div>
);

export default Profile;