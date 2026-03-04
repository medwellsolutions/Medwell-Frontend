import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const currentMonthKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

const buildRecentMonths = (count = 12) => {
  const out = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < count; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    out.push(`${y}-${m}`);
    d.setMonth(d.getMonth() - 1);
  }
  return out;
};

const prettyMonth = (monthKey) => {
  const [y, m] = String(monthKey || "").split("-");
  if (!y || !m) return monthKey;
  const dt = new Date(Number(y), Number(m) - 1, 1);
  return dt.toLocaleString(undefined, { month: "long", year: "numeric" });
};

const trophy = (rank) => {
  if (rank === 1) return "🏆";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "🎯";
};

const Leaderboard = () => {
  const [monthKey, setMonthKey] = useState(currentMonthKey());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const monthOptions = useMemo(() => buildRecentMonths(12), []);

  const fetchLeaderboard = async (mk) => {
    try {
      setLoading(true);
      setErr("");
      const res = await axios.get(`${BASE_URL}/leaderboard`, {
        params: { monthKey: mk },
        withCredentials: true,
      });
      setRows(res?.data?.data || []);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load leaderboard");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(monthKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  // UI helpers (local so each file is self-contained)
  const Card = ({ className = "", children }) => (
    <div className={`bg-white border border-gray-200 rounded-3xl shadow-sm ${className}`}>
      {children}
    </div>
  );

  const PrimaryPill = ({ className = "", children }) => (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1.5 font-extrabold",
        "bg-[#e13429] text-white",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );

  const SoftPill = ({ className = "", children }) => (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1.5 font-extrabold",
        "bg-gray-100 text-gray-900 border border-gray-200",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );

  const OutlineButton = ({ className = "", ...props }) => (
    <button
      {...props}
      className={[
        "h-11 rounded-full px-5 font-medium",
        "border border-[#e13429] text-[#e13429] hover:bg-red-50 transition",
        className,
      ].join(" ")}
    />
  );

  const Select = ({ className = "", ...props }) => (
    <select
      {...props}
      className={[
        "h-11 rounded-2xl px-4 bg-white",
        "border border-gray-200 text-gray-900",
        "focus:outline-none focus:ring-2 focus:ring-[#e13429]/30",
        className,
      ].join(" ")}
    />
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Leaderboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Rank • Name • Points (monthly)
            </p>
          </div>

          {/* Month Filter */}
          <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
            <Card className="px-4 py-2">
              <div className="text-[11px] text-gray-500">Month</div>
              <div className="text-sm font-extrabold text-[#e13429]">
                {prettyMonth(monthKey)}
              </div>
            </Card>

            <Select value={monthKey} onChange={(e) => setMonthKey(e.target.value)}>
              {monthOptions.map((mk) => (
                <option key={mk} value={mk}>
                  {prettyMonth(mk)}
                </option>
              ))}
            </Select>

            <OutlineButton onClick={() => fetchLeaderboard(monthKey)}>
              Refresh
            </OutlineButton>
          </div>
        </div>

        {/* Info */}
        <Card className="mb-6 px-4 py-3">
          <p className="text-sm text-gray-600">
            Points update after admin approval ✅{" "}
            <span className="text-gray-500">
              (Users with no approved submissions in this month won’t appear.)
            </span>
          </p>
        </Card>

        {/* Table Card */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-5 py-4 text-sm font-bold text-[#e13429]">
                    Rank
                  </th>
                  <th className="px-5 py-4 text-sm font-bold text-[#e13429]">
                    Name
                  </th>
                  <th className="px-5 py-4 text-sm font-bold text-[#e13429] text-right">
                    Points
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center">
                      <div className="inline-flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full border-4 border-gray-200 border-t-[#e13429] animate-spin" />
                        <span className="text-gray-600">Loading leaderboard…</span>
                      </div>
                    </td>
                  </tr>
                ) : err ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-6">
                      <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                        {err}
                      </div>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-10 text-center text-gray-600">
                      No leaderboard data for{" "}
                      <span className="font-semibold text-[#e13429]">
                        {prettyMonth(monthKey)}
                      </span>
                      .
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const rank = Number(r.rank || 0);
                    const top3 = rank >= 1 && rank <= 3;

                    const name =
                      `${r.firstName || ""} ${r.lastName || ""}`.trim() ||
                      r.name ||
                      "Unknown";

                    return (
                      <tr
                        key={r.userId || `${name}-${rank}`}
                        className={top3 ? "bg-red-50/40" : "bg-white"}
                      >
                        {/* Rank */}
                        <td className="px-5 py-4">
                          <span
                            className={[
                              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-bold border",
                              top3
                                ? "bg-[#e13429] text-white border-[#e13429]"
                                : "bg-gray-100 text-gray-900 border-gray-200",
                            ].join(" ")}
                          >
                            <span>{trophy(rank)}</span>
                            <span>#{rank}</span>
                          </span>
                        </td>

                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">
                            {name}
                          </div>
                          {r.userId && (
                            <div className="text-xs text-gray-500">
                              User: {String(r.userId).slice(-6)}
                            </div>
                          )}
                        </td>

                        {/* Points */}
                        <td className="px-5 py-4 text-right">
                          {top3 ? (
                            <PrimaryPill>{Number(r.points || 0)}</PrimaryPill>
                          ) : (
                            <SoftPill>{Number(r.points || 0)}</SoftPill>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-4 text-xs text-gray-500">
          Month:{" "}
          <span className="font-semibold text-[#e13429]">
            {prettyMonth(monthKey)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;