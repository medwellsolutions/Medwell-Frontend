import React, { useEffect, useState, useMemo } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  return isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
};

const ROLE_META = {
  supplier: {
    label: "Supplier",
    bg: "bg-amber-50",
    text: "text-amber-800",
    ring: "ring-amber-200",
    dot: "bg-amber-400",
  },
  "non-profit": {
    label: "Non-Profit",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    ring: "ring-emerald-200",
    dot: "bg-emerald-400",
  },
  sponsor: {
    label: "Sponsor",
    bg: "bg-blue-50",
    text: "text-blue-800",
    ring: "ring-blue-200",
    dot: "bg-blue-400",
  },
  doctor: {
    label: "Doctor",
    bg: "bg-violet-50",
    text: "text-violet-800",
    ring: "ring-violet-200",
    dot: "bg-violet-400",
  },
  participant: {
    label: "Participant",
    bg: "bg-rose-50",
    text: "text-rose-800",
    ring: "ring-rose-200",
    dot: "bg-rose-400",
  },
};

const STATUS_META = {
  hold: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    dot: "bg-amber-400",
  },
  accepted: {
    label: "Accepted",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    dot: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    dot: "bg-rose-400",
  },
};

const RolePill = ({ role }) => {
  const m = ROLE_META[role] || {
    label: role,
    bg: "bg-slate-50",
    text: "text-slate-700",
    ring: "ring-slate-200",
    dot: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${m.bg} ${m.text} ${m.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

const StatusPill = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.hold;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${m.bg} ${m.text} ${m.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};

const ROLES = ["all", "supplier", "non-profit", "sponsor", "doctor", "participant"];
const STATUSES = ["all", "hold", "accepted", "rejected"];

/* ── main component ── */
const VettingApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${BASE_URL}/admin/vettings`, {
          withCredentials: true,
        });
        setApplications(res?.data?.data || []);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || "Failed to fetch vetting applications");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchRole = roleFilter === "all" || a.role === roleFilter;
      const matchStatus = statusFilter === "all" || a.reviewStatus === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.email?.toLowerCase().includes(q) ||
        a.businessName?.toLowerCase().includes(q) ||
        a.legalName?.toLowerCase().includes(q) ||
        a.clinicName?.toLowerCase().includes(q) ||
        a.firstName?.toLowerCase().includes(q) ||
        a.lastName?.toLowerCase().includes(q);
      return matchRole && matchStatus && matchSearch;
    });
  }, [applications, roleFilter, statusFilter, search]);

  // counts per role for the tab badges
  const roleCounts = useMemo(() => {
    const counts = { all: applications.length };
    applications.forEach((a) => {
      counts[a.role] = (counts[a.role] || 0) + 1;
    });
    return counts;
  }, [applications]);

  const handleView = (app) => {
    navigate(`/home/admin/vetting/${app.role}/${app._id}`);
  };

  // derive display name from whichever field exists per role
  const getDisplayName = (app) => {
    if (app.businessName) return app.businessName;
    if (app.legalName) return app.legalName;
    if (app.clinicName) return app.clinicName;
    if (app.firstName || app.lastName)
      return `${app.firstName || ""} ${app.lastName || ""}`.trim();
    return app.email || "—";
  };

  const getSubtitle = (app) => {
    if (app.role === "supplier") return app.businessStructure || "";
    if (app.role === "non-profit") return app.stateIncorp ? `Inc. in ${app.stateIncorp}` : "";
    if (app.role === "sponsor") return app.entityType || "";
    if (app.role === "doctor") return app.practiceAddress || "";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Vetting Applications
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            All partner registrations — suppliers, non-profits, sponsors, and doctors.
          </p>
        </div>

        {/* Role tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/30
                ${roleFilter === r
                  ? "bg-[#e13429] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-[#e13429]/40 hover:text-[#e13429]"
                }`}
            >
              {r === "all" ? "All" : ROLE_META[r]?.label || r}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none
                  ${roleFilter === r ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {roleCounts[r] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search + status filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/40"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#e13429]/20 focus:border-[#e13429]/40"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : STATUS_META[s]?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-[#e13429]" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* List */}
        {!loading && !error && (
          <>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.08)] divide-y divide-slate-100 overflow-hidden">
              {filtered.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 hover:bg-slate-50/70 transition group"
                >
                  {/* Left */}
                  <div className="flex items-start gap-4">
                    {/* Avatar initial */}
                    <div className="shrink-0 h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-base font-extrabold text-[#e13429] select-none">
                      {getDisplayName(app).charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-base leading-tight">
                        {getDisplayName(app)}
                      </div>
                      {getSubtitle(app) && (
                        <div className="text-xs text-slate-500 mt-0.5">{getSubtitle(app)}</div>
                      )}
                      <div className="text-xs text-slate-400 mt-0.5">{app.email}</div>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <RolePill role={app.role} />
                        <StatusPill status={app.reviewStatus} />
                        <span className="text-xs text-slate-400">
                          {formatDate(app.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <button
                    onClick={() => handleView(app)}
                    className="shrink-0 px-6 h-10 rounded-full border border-[#e13429] text-[#e13429] text-sm font-semibold hover:bg-[#e13429] hover:text-white transition focus:outline-none focus:ring-2 focus:ring-[#e13429]/30"
                  >
                    Review →
                  </button>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <div className="text-3xl mb-3">📋</div>
                  <p className="text-slate-500 text-sm font-medium">No applications found.</p>
                  {(roleFilter !== "all" || statusFilter !== "all" || search) && (
                    <button
                      onClick={() => { setRoleFilter("all"); setStatusFilter("all"); setSearch(""); }}
                      className="mt-3 text-xs text-[#e13429] font-semibold hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Count footer */}
            {filtered.length > 0 && (
              <p className="mt-4 text-xs text-slate-400 text-right">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
                <span className="font-semibold text-slate-600">{applications.length}</span> applications
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VettingApplications;