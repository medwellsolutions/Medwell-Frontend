import React, { useEffect, useMemo, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useParams } from "react-router-dom";
import axios from "axios";

/* ------------------------------ Utilities ------------------------------ */

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
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};
const isHex24 = (v) => typeof v === "string" && /^[a-f0-9]{24}$/i.test(v);

/* =========================================================
   Medwell Theme (keep 2/3/4):
   - Warm peach/orange gradient backdrop
   - Rounded white cards with gentle shadow + soft gray borders
   - Primary action color: #e13429
   - Pastel chips, restrained playful vibe
   ========================================================= */
const MW = {
  page: "min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 px-4 py-10",
  shell: "max-w-6xl mx-auto",
  headerCard:
    "rounded-3xl bg-white/90 backdrop-blur border border-slate-200/80 shadow-[0_12px_32px_rgba(15,23,42,0.10)] px-6 sm:px-8 py-6",
  title: "text-2xl sm:text-3xl font-extrabold text-slate-900",
  sub: "mt-1 text-sm text-slate-600",

  card:
    "rounded-3xl bg-white/90 backdrop-blur border border-slate-200/80 shadow-[0_10px_26px_rgba(15,23,42,0.08)]",
  cardHeader:
    "flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200/70",
  cardTitle: "text-sm font-extrabold text-slate-900",
  cardBody: "px-4 sm:px-6 py-4",

  fieldLabel: "w-40 shrink-0 text-sm font-semibold text-slate-600",
  fieldValue: "flex-1 text-sm text-slate-900 break-words",

  input:
    "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 " +
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
    "rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-700 " +
    "hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/25",

  chipBase:
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1",
};

/* ------------------------------ Small UI ------------------------------ */

const CopyButton = ({ value, className }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(String(value ?? ""));
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        } catch {}
      }}
      className={cn(
        "text-xs px-2 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/20",
        className
      )}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const Pill = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-slate-100 text-slate-800 ring-slate-200",
    success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    warning: "bg-amber-50 text-amber-900 ring-amber-200",
    danger: "bg-rose-50 text-rose-800 ring-rose-200",
    info: "bg-blue-50 text-blue-800 ring-blue-200",
    violet: "bg-violet-50 text-violet-800 ring-violet-200",
  };
  return (
    <span className={cn(MW.chipBase, "ring-1", tones[tone])}>{children}</span>
  );
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
  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 py-2">
    <div className={MW.fieldLabel}>{label}</div>
    <div className={MW.fieldValue}>{children ?? "—"}</div>
  </div>
);

/* ------------------------------ File helpers ------------------------------ */

async function previewFile(fileId) {
  const res = await fetch(`${BASE_URL}/admin/file/${fileId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Preview failed (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
}

function downloadFile(fileId) {
  const a = document.createElement("a");
  a.href = `${BASE_URL}/admin/file/${fileId}`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}

const FileChip = ({ fileId, label }) => {
  if (!fileId) return <span className="text-slate-400">—</span>;
  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-extrabold text-slate-800">
        {label || "File"}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => previewFile(fileId).catch(console.error)}
          className={cn(MW.btnGhost, "px-3 py-1.5 text-xs")}
          title="Preview"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => downloadFile(fileId)}
          className={cn(MW.btnGhost, "px-3 py-1.5 text-xs")}
          title="Download"
        >
          Download
        </button>
      </div>
    </div>
  );
};

/* ------------------------------ Renderers ------------------------------ */

const RenderArray = ({ arr }) => {
  if (!Array.isArray(arr) || arr.length === 0)
    return <span className="text-slate-400">—</span>;

  const allPrimitive = arr.every((x) => typeof x !== "object" || x === null);
  if (allPrimitive) {
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, idx) => (
          <Pill key={idx} tone="neutral">
            {String(item)}
          </Pill>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {arr.map((item, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 bg-white p-3"
        >
          <KeyValueGrid obj={item} />
        </div>
      ))}
    </div>
  );
};

const RenderValue = ({ value, k }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400">—</span>;
  }

  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    "fileId" in value &&
    isHex24(value.fileId)
  ) {
    return <FileChip fileId={value.fileId} label={k} />;
  }

  if (
    typeof value === "string" &&
    isHex24(value) &&
    /file|doc|license|logo|w9|headshot/i.test(k || "")
  ) {
    return <FileChip fileId={value} label={k} />;
  }

  if (Array.isArray(value)) return <RenderArray arr={value} />;
  if (typeof value === "object") return <KeyValueGrid obj={value} />;

  const str = String(value);
  if (isUrl(str)) {
    return (
      <a
        href={str}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 decoration-slate-300 hover:decoration-slate-700 break-all text-slate-700"
      >
        {str}
      </a>
    );
  }
  return <span className="break-words">{str}</span>;
};

const KeyValueGrid = ({ obj }) => {
  if (!obj || typeof obj !== "object")
    return <div className="text-slate-400">—</div>;

  const entries = Object.entries(obj);
  if (!entries.length) return <div className="text-slate-400">—</div>;

  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] gap-4">
      {entries.map(([k, v]) => (
        <div
          key={k}
          className="min-w-[240px] rounded-2xl border border-slate-200 bg-white p-3 overflow-hidden"
        >
          <div className="text-xs uppercase tracking-wide text-slate-500">
            {k}
          </div>
          <div className="mt-1 text-sm text-slate-900 break-words">
            <RenderValue value={v} k={k} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ------------------------------ Main ------------------------------ */

const ViewApplication = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // USER ID for the GET route

  const [newStatus, setNewStatus] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);

  // award + comment controls
  const [hoursAwarded, setHoursAwarded] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/application/${id}`, {
          withCredentials: true,
        });
        const d = res?.data?.data ?? null;
        setDetails(d);

        if (d) {
          setNewStatus(d.reviewStatus || "hold");
          setHoursAwarded(Number(d.hoursAwarded || 0));
          setPointsAwarded(Number(d.pointsAwarded || 0));
          setReviewComment(d.reviewComment || "");
        }
      } catch (err) {
        console.error("Failed to fetch application:", err?.response?.data || err?.message);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async () => {
    if (!details?._id) return;

    const effectiveStatus = newStatus || details.reviewStatus || "hold";

    if (effectiveStatus === "rejected" && !String(reviewComment).trim()) {
      alert("Rejection comment is required");
      return;
    }

    setLoadingStatus(true);
    try {
      await axios.patch(
        `${BASE_URL}/admin/application/${details._id}/status`,
        {
          reviewStatus: effectiveStatus,
          hoursAwarded: Number(hoursAwarded || 0),
          pointsAwarded: Number(pointsAwarded || 0),
          reviewComment: String(reviewComment || ""),
        },
        { withCredentials: true }
      );

      setDetails((prev) => ({
        ...prev,
        reviewStatus: effectiveStatus,
        hoursAwarded: effectiveStatus === "accepted" ? Number(hoursAwarded || 0) : 0,
        pointsAwarded: effectiveStatus === "accepted" ? Number(pointsAwarded || 0) : 0,
        reviewComment: effectiveStatus === "rejected" ? String(reviewComment || "").trim() : "",
      }));
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingStatus(false);
    }
  };

  const {
    _id: applicationId,
    user,
    email,
    reviewStatus,
    role,
    createdAt,
    updatedAt,
    ...rest
  } = details || {};

  const statusTone = useMemo(() => {
    const s = String(reviewStatus || "").toLowerCase();
    if (["accepted", "approved", "verified"].includes(s)) return "success";
    if (["rejected", "denied", "blocked"].includes(s)) return "danger";
    if (["hold", "pending", "under review"].includes(s)) return "warning";
    return "neutral";
  }, [reviewStatus]);

  const effectiveStatus = newStatus || reviewStatus || "hold";
  const canEditAwards = effectiveStatus === "accepted";

  if (loading) {
    return (
      <div className={MW.page}>
        <div className={MW.shell}>
          <div className="animate-pulse text-sm text-slate-600">
            Loading application…
          </div>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className={MW.page}>
        <div className={MW.shell}>
          <div className="text-sm text-slate-600">No application found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={MW.page}>
      <div className={MW.shell}>
        {/* Header */}
        <div className={MW.headerCard}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className={MW.title}>Application</h2>
              <div className={MW.sub}>
                Application ID:&nbsp;
                <span className="font-mono text-slate-700">{applicationId}</span>
                <CopyButton className="ml-2" value={applicationId} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Pill tone={statusTone}>{reviewStatus || "N/A"}</Pill>
              {role ? <Pill tone="violet">{role}</Pill> : null}
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Applicant">
              <FieldRow label="User ID">
                {user ? (
                  <>
                    <span className="font-mono">{String(user)}</span>
                    <CopyButton className="ml-2" value={String(user)} />
                  </>
                ) : (
                  "—"
                )}
              </FieldRow>
              <FieldRow label="Email">{email || "—"}</FieldRow>
              <FieldRow label="Role">
                {role ? (
                  <Pill tone="violet">{role}</Pill>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </FieldRow>
            </Section>

            <Section title="Role-specific data">
              <KeyValueGrid obj={rest} />
            </Section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Section
              title="Status & Timestamps"
              right={
                <button
                  onClick={handleStatusChange}
                  disabled={loadingStatus}
                  className={MW.btnPrimary}
                >
                  {loadingStatus ? "Updating..." : "Update"}
                </button>
              }
            >
              <FieldRow label="Review Status">
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={newStatus || reviewStatus || "hold"}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className={MW.select}
                  >
                    <option value="hold">Hold</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <span className="text-xs text-slate-500">
                    Primary action color:{" "}
                    <span className="font-semibold">#e13429</span>
                  </span>
                </div>
              </FieldRow>

              <FieldRow label="Hours Awarded">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={hoursAwarded}
                    onChange={(e) => setHoursAwarded(e.target.value)}
                    disabled={!canEditAwards}
                    className={cn(MW.input, "w-32", !canEditAwards && "opacity-60 cursor-not-allowed")}
                  />
                  {!canEditAwards && (
                    <span className="text-xs text-slate-500">
                      Set status to <span className="font-semibold">Accepted</span> to award hours
                    </span>
                  )}
                </div>
              </FieldRow>

              <FieldRow label="Points Awarded">
                <input
                  type="number"
                  min="0"
                  value={pointsAwarded}
                  onChange={(e) => setPointsAwarded(e.target.value)}
                  disabled={!canEditAwards}
                  className={cn(MW.input, "w-32", !canEditAwards && "opacity-60 cursor-not-allowed")}
                />
              </FieldRow>

              <FieldRow label="Review Comment">
                <div className="w-full">
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Required if rejecting"
                    className={cn(MW.textarea, "w-full", effectiveStatus !== "rejected" && "opacity-90")}
                  />
                  {effectiveStatus === "rejected" && !String(reviewComment).trim() ? (
                    <div className="mt-1 text-xs text-rose-600 font-semibold">
                      Comment required for rejection
                    </div>
                  ) : null}
                </div>
              </FieldRow>

              <FieldRow label="Created At">{formatDate(createdAt)}</FieldRow>
              <FieldRow label="Updated At">{formatDate(updatedAt)}</FieldRow>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;