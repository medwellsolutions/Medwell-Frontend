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
        "text-xs px-2 py-1 rounded-md border hover:bg-gray-50 transition",
        className
      )}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

const Pill = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-900 border border-amber-200",
    danger: "bg-rose-100 text-rose-800 border border-rose-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    violet: "bg-violet-100 text-violet-800 border border-violet-200",
  };
  return (
    <span className={cn("px-2 py-0.5 text-xs rounded-full", tones[tone])}>
      {children}
    </span>
  );
};

const Section = ({ title, children, right }) => (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {right}
    </div>
    <div className="px-4 sm:px-6 py-4">{children}</div>
  </div>
);

const FieldRow = ({ label, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 py-2">
    <div className="w-40 shrink-0 text-sm font-medium text-gray-600">{label}</div>
    <div className="flex-1 text-sm text-gray-900 break-words">{children ?? "—"}</div>
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
  if (!fileId) return <span className="text-gray-400">—</span>;
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3">
      <div className="text-xs font-medium text-gray-700">
        {label || "File"}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => previewFile(fileId).catch(console.error)}
          className="text-xs border rounded-md px-2 py-1 hover:bg-gray-100 whitespace-nowrap"
          title="Preview"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => downloadFile(fileId)}
          className="text-xs border rounded-md px-2 py-1 hover:bg-gray-100 whitespace-nowrap"
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
    return <span className="text-gray-400">—</span>;
  const allPrimitive = arr.every((x) => typeof x !== "object" || x === null);
  if (allPrimitive) {
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, idx) => (
          <Pill key={idx}>{String(item)}</Pill>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {arr.map((item, idx) => (
        <div key={idx} className="rounded-xl border border-gray-100 p-3">
          <KeyValueGrid obj={item} />
        </div>
      ))}
    </div>
  );
};

const RenderValue = ({ value, k }) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-400">—</span>;
  }

  // If this value itself is a file-shaped object { fileId, ... }
  if (typeof value === "object" && !Array.isArray(value) && "fileId" in value && isHex24(value.fileId)) {
    return <FileChip fileId={value.fileId} label={k} />;
  }

  // If primitive-looking file under file-ish key
  if (typeof value === "string" && isHex24(value) && /file|doc|license|logo|w9|headshot/i.test(k || "")) {
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
        className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-600 break-all"
      >
        {str}
      </a>
    );
  }
  return <span className="break-words">{str}</span>;
};

const KeyValueGrid = ({ obj }) => {
  if (!obj || typeof obj !== "object") return <div className="text-gray-400">—</div>;
  const entries = Object.entries(obj);
  if (!entries.length) return <div className="text-gray-400">—</div>;

  return (
    <div className="grid [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] gap-4">
      {entries.map(([k, v]) => (
        <div key={k} className="min-w-[240px] rounded-xl border border-gray-100 p-3 overflow-hidden">
          <div className="text-xs uppercase tracking-wide text-gray-500">{k}</div>
          <div className="mt-1 text-sm text-gray-900 break-words">
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
  const { id } = useParams(); // NOTE: this is USER ID for the GET route
  const [newStatus, setNewStatus] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleStatusChange = async () => {
    if (!newStatus || !details?._id) return;
    setLoadingStatus(true);
    try {
      // PATCH expects the APPLICATION (Details) id
      await axios.patch(
        `${BASE_URL}/admin/application/${details._id}/status`,
        { reviewStatus: newStatus },
        { withCredentials: true }
      );
      setDetails((prev) => ({ ...prev, reviewStatus: newStatus }));
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err?.response?.data?.error || "Failed to update status");
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // GET expects USER ID and returns the Details doc (with role-specific fields)
        const res = await axios.get(`${BASE_URL}/admin/application/${id}`, {
          withCredentials: true,
        });
        setDetails(res?.data?.data ?? null);
      } catch (err) {
        console.error("Failed to fetch application:", err?.response?.data || err?.message);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Pull out common headers; keep everything else under "rest"
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse text-sm text-gray-500">Loading application…</div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-sm text-gray-500">No application found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Application</h2>
        <div className="mt-1 text-sm text-gray-500">
          Application ID:&nbsp;
          <span className="font-mono">{applicationId}</span>
          <CopyButton className="ml-2" value={applicationId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Applicant & Role-Specific */}
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
              {role ? <Pill tone="violet">{role}</Pill> : <span className="text-gray-400">—</span>}
            </FieldRow>
          </Section>

          <Section title="Role-specific data">
            {/* This grid renders ALL remaining fields from the discriminator payload */}
            <KeyValueGrid obj={rest} />
          </Section>
        </div>

        {/* Right: Status & timestamps */}
        <div className="space-y-6">
          <Section title="Status & Timestamps">
            <FieldRow label="Review Status">
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone={statusTone}>{reviewStatus || "N/A"}</Pill>
                <select
                  value={newStatus || reviewStatus || "hold"}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="hold">Hold</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={handleStatusChange}
                  disabled={loadingStatus}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingStatus ? "Updating..." : "Update"}
                </button>
              </div>
            </FieldRow>

            <FieldRow label="Created At">{formatDate(createdAt)}</FieldRow>
            <FieldRow label="Updated At">{formatDate(updatedAt)}</FieldRow>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;
