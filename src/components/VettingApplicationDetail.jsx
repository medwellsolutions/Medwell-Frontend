import React, { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* ── helpers ── */
const cn = (...c) => c.filter(Boolean).join(" ");

const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const isUrl = (v = "") => {
  try { new URL(v); return true; } catch { return false; }
};

const isHex24 = (v) => typeof v === "string" && /^[a-f0-9]{24}$/i.test(v);

const humanLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^\s/, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ── theme ── */
const MW = {
  page: "min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 px-4 py-10",
  shell: "max-w-6xl mx-auto",
  headerCard:
    "rounded-3xl bg-white/90 backdrop-blur border border-slate-200/80 shadow-[0_12px_32px_rgba(15,23,42,0.10)] px-6 sm:px-8 py-6",
  title: "text-2xl sm:text-3xl font-extrabold text-slate-900",
  sub: "mt-1 text-sm text-slate-500",
  card: "rounded-3xl bg-white/90 backdrop-blur border border-slate-200/80 shadow-[0_10px_26px_rgba(15,23,42,0.08)]",
  cardHeader: "flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200/70",
  cardTitle: "text-sm font-extrabold text-slate-900",
  cardBody: "px-4 sm:px-6 py-4",
  fieldLabel: "w-44 shrink-0 text-sm font-semibold text-slate-600",
  fieldValue: "flex-1 text-sm text-slate-900 break-words",
  input:
    "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 " +
    "focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/35",
  textarea:
    "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/35",
  select:
    "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 " +
    "focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/35",
  btnPrimary:
    "rounded-full bg-[#e13429] px-4 py-2 text-sm font-extrabold text-white " +
    "hover:bg-[#c92d25] active:bg-[#b82620] transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/35 disabled:opacity-70",
  btnGhost:
    "rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 " +
    "hover:bg-slate-50 transition focus:outline-none",
  chipBase: "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
};

const STATUS_META = {
  hold:     { label: "Pending",  tone: "warning",  bg: "bg-amber-50",   text: "text-amber-700",   ring: "ring-amber-200",   dot: "bg-amber-400" },
  accepted: { label: "Accepted", tone: "success",  bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-400" },
  rejected: { label: "Rejected", tone: "danger",   bg: "bg-rose-50",    text: "text-rose-700",    ring: "ring-rose-200",    dot: "bg-rose-400" },
};

const ROLE_META = {
  supplier:    { label: "Supplier",    bg: "bg-amber-50",   text: "text-amber-800",   ring: "ring-amber-200" },
  "non-profit":{ label: "Non-Profit",  bg: "bg-emerald-50", text: "text-emerald-800", ring: "ring-emerald-200" },
  sponsor:     { label: "Sponsor",     bg: "bg-blue-50",    text: "text-blue-800",    ring: "ring-blue-200" },
  doctor:      { label: "Doctor",      bg: "bg-violet-50",  text: "text-violet-800",  ring: "ring-violet-200" },
  participant: { label: "Participant", bg: "bg-rose-50",    text: "text-rose-800",    ring: "ring-rose-200" },
};

/* ── small UI ── */
const StatusPill = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.hold;
  return (
    <span className={cn(MW.chipBase, m.bg, m.text, m.ring)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
};

const RolePill = ({ role }) => {
  const m = ROLE_META[role] || { label: role, bg: "bg-slate-50", text: "text-slate-700", ring: "ring-slate-200" };
  return (
    <span className={cn(MW.chipBase, m.bg, m.text, m.ring)}>{m.label}</span>
  );
};

const Pill = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-slate-100 text-slate-800 ring-slate-200",
    success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warning: "bg-amber-50 text-amber-900 ring-amber-200",
    danger:  "bg-rose-50 text-rose-800 ring-rose-200",
    info:    "bg-blue-50 text-blue-800 ring-blue-200",
    violet:  "bg-violet-50 text-violet-800 ring-violet-200",
  };
  return <span className={cn(MW.chipBase, tones[tone])}>{children}</span>;
};

const Section = ({ title, children, right }) => (
  <div className={MW.card}>
    <div className={MW.cardHeader}>
      <h3 className={MW.cardTitle}>{title}</h3>
      {right}
    </div>
    <div className={MW.cardBody}>{children}</div>
  </div>
);

const FieldRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 py-2.5 border-b border-slate-100 last:border-0">
    <div className={MW.fieldLabel}>{label}</div>
    <div className={MW.fieldValue}>{children ?? <span className="text-slate-400">—</span>}</div>
  </div>
);

/* ── file helpers ── */
const FileChip = ({ file, label }) => {
  if (!file) return <span className="text-slate-400">—</span>;

  // GridFS style: { fileId: ObjectId } (non-profit / doctor)
  const fileId = file?.fileId;
  // S3 style: { url: "https://..." } (supplier)
  const s3Url = file?.url;

  if (!fileId && !s3Url) return <span className="text-slate-400">—</span>;

  const handlePreview = async () => {
    if (s3Url) { window.open(s3Url, "_blank", "noopener,noreferrer"); return; }
    try {
      const res = await fetch(`${BASE_URL}/admin/file/${fileId}`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
    } catch (e) { alert("Preview failed: " + e.message); }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-extrabold text-slate-700">{label || "File"}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={handlePreview} className={MW.btnGhost}>Preview</button>
        {s3Url && (
          <a href={s3Url} target="_blank" rel="noreferrer" className={MW.btnGhost}>Download</a>
        )}
        {fileId && (
          <a href={`${BASE_URL}/admin/file/${fileId}`} target="_blank" rel="noreferrer" className={MW.btnGhost}>Download</a>
        )}
      </div>
    </div>
  );
};

/* ── recursive value renderer ── */
const RenderValue = ({ value, k }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">—</span>;
  }

  // GridFS file ref: { fileId, filename, ... }
  if (typeof value === "object" && !Array.isArray(value) && "fileId" in value && isHex24(String(value.fileId))) {
    return <FileChip file={value} label={humanLabel(k || "")} />;
  }
  // S3 file ref: { url: "https://..." }
  if (typeof value === "object" && !Array.isArray(value) && "url" in value && typeof value.url === "string" && isUrl(value.url)) {
    return <FileChip file={value} label={humanLabel(k || "")} />;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-400">—</span>;
    const allPrimitive = value.every((x) => typeof x !== "object" || x === null);
    if (allPrimitive) {
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, i) => <Pill key={i}>{String(item)}</Pill>)}
        </div>
      );
    }
    // Array of file refs (e.g. mediaKit: [{ url: "..." }, ...])
    const allFileRefs = value.every(
      (x) => x && typeof x === "object" && (
        ("url" in x && typeof x.url === "string" && isUrl(x.url)) ||
        ("fileId" in x && isHex24(String(x.fileId)))
      )
    );
    if (allFileRefs) {
      return (
        <div className="space-y-2">
          {value.map((item, i) => (
            <FileChip key={i} file={item} label={`${humanLabel(k || "File")} ${i + 1}`} />
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {value.map((item, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-3">
            <RecursiveGrid obj={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <Pill tone={value ? "success" : "danger"}>{value ? "Yes" : "No"}</Pill>;
  }

  if (typeof value === "object") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <RecursiveGrid obj={value} />
      </div>
    );
  }

  const str = String(value);
  if (isUrl(str)) {
    return (
      <a href={str} target="_blank" rel="noreferrer"
        className="underline underline-offset-2 decoration-slate-300 hover:decoration-[#e13429] text-slate-700 break-all">
        {str}
      </a>
    );
  }
  return <span className="break-words">{str}</span>;
};

const SKIP_KEYS = new Set(["_id", "__v", "user", "email", "role", "reviewStatus", "reviewedBy", "reviewedAt", "reviewerNotes", "createdAt", "updatedAt"]);

const RecursiveGrid = ({ obj }) => {
  if (!obj || typeof obj !== "object") return <span className="text-slate-400">—</span>;
  const entries = Object.entries(obj).filter(([k]) => !SKIP_KEYS.has(k));
  if (!entries.length) return <span className="text-slate-400">—</span>;
  return (
    <div className="space-y-0">
      {entries.map(([k, v]) => (
        <FieldRow key={k} label={humanLabel(k)}>
          <RenderValue value={v} k={k} />
        </FieldRow>
      ))}
    </div>
  );
};

/* ── main component ── */
const VettingApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newStatus, setNewStatus] = useState("hold");
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${BASE_URL}/admin/vetting/${id}`, { withCredentials: true });
        const data = res?.data?.data || null;
        setDoc(data);
        if (data) {
          setNewStatus(data.reviewStatus || "hold");
          setReviewerNotes(data.reviewerNotes || "");
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load application");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleUpdate = async () => {
    if (newStatus === "rejected" && !reviewerNotes.trim()) {
      alert("Reviewer notes are required when rejecting.");
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      await axios.patch(
        `${BASE_URL}/admin/vetting/${id}/status`,
        { reviewStatus: newStatus, reviewerNotes },
        { withCredentials: true }
      );
      setDoc((prev) => ({ ...prev, reviewStatus: newStatus, reviewerNotes }));
      setSaveMsg("Status updated successfully.");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const statusMeta = useMemo(() => STATUS_META[doc?.reviewStatus] || STATUS_META.hold, [doc]);

  if (loading) {
    return (
      <div className={MW.page}>
        <div className={MW.shell}>
          <div className="animate-pulse text-sm text-slate-500">Loading application…</div>
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className={MW.page}>
        <div className={MW.shell}>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error || "Application not found."}
          </div>
        </div>
      </div>
    );
  }

  const { role, email, reviewStatus, reviewedAt, createdAt, updatedAt, ...rest } = doc;

  return (
    <div className={MW.page}>
      <div className={MW.shell}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#e13429] transition"
        >
          ← Back to Vettings
        </button>

        {/* Header card */}
        <div className={MW.headerCard}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className={MW.title}>Vetting Application</h2>
              <p className={cn(MW.sub, "font-mono")}>{id}</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <StatusPill status={reviewStatus} />
              {role && <RolePill role={role} />}
            </div>
          </div>

          {/* Core info row */}
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="font-semibold text-slate-500">Email </span>
              <span className="text-slate-800">{email || "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">Submitted </span>
              <span className="text-slate-800">{formatDate(createdAt)}</span>
            </div>
            {reviewedAt && (
              <div>
                <span className="font-semibold text-slate-500">Reviewed </span>
                <span className="text-slate-800">{formatDate(reviewedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — application data */}
          <div className="lg:col-span-2">
            <Section title="Application Details">
              <RecursiveGrid obj={rest} />
            </Section>
          </div>

          {/* Right — review panel */}
          <div className="space-y-6">
            <Section
              title="Review Decision"
              right={
                <button
                  onClick={handleUpdate}
                  disabled={saving}
                  className={MW.btnPrimary}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              }
            >
              {/* Status selector */}
              <div className="py-2.5 space-y-1">
                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className={cn(MW.select, "w-full mt-1")}
                >
                  <option value="hold">Pending / Hold</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Status badge preview */}
              <div className="py-1 flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Preview:</span>
                <StatusPill status={newStatus} />
              </div>

              {/* Reviewer notes */}
              <div className="py-2.5 space-y-1">
                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wide">
                  Reviewer Notes
                  {newStatus === "rejected" && (
                    <span className="ml-1 text-rose-600">*required</span>
                  )}
                </label>
                <textarea
                  rows={4}
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  placeholder={newStatus === "rejected" ? "Reason for rejection (required)" : "Optional internal notes…"}
                  className={cn(MW.textarea, "w-full mt-1")}
                />
                {newStatus === "rejected" && !reviewerNotes.trim() && (
                  <p className="text-xs font-semibold text-rose-600">Notes are required for rejection</p>
                )}
              </div>

              {saveMsg && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                  {saveMsg}
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-3 space-y-2 border-t border-slate-100 mt-2">
                <FieldRow label="Created">{formatDate(createdAt)}</FieldRow>
                <FieldRow label="Updated">{formatDate(updatedAt)}</FieldRow>
                {reviewedAt && <FieldRow label="Reviewed At">{formatDate(reviewedAt)}</FieldRow>}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VettingApplicationDetail;
