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

      // expects backend data with rank already computed
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

  return (
    <div className="min-h-screen bg-white px-4 sm:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700">
              Leaderboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-sky-600">
              Rank • Name • Points (monthly)
            </p>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-700 px-4 py-2 text-white shadow-sm">
              <div className="text-[11px] opacity-90">Month</div>
              <div className="text-sm font-semibold">{prettyMonth(monthKey)}</div>
            </div>

            <select
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
              className="rounded-2xl border border-blue-300 px-3 py-2 text-blue-700 font-semibold bg-white hover:bg-blue-50 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              {monthOptions.map((mk) => (
                <option key={mk} value={mk}>
                  {prettyMonth(mk)}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchLeaderboard(monthKey)}
              className="rounded-2xl border border-blue-300 px-4 py-2 text-blue-700 font-semibold hover:bg-blue-50 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Info card */}
        <div className="mb-6 rounded-3xl bg-blue-700 text-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm sm:text-base font-semibold">
            Points update after admin approval ✅
          </div>
          <div className="text-xs sm:text-sm opacity-90 mt-1">
            Users with no approved submissions in this month won’t appear.
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl border border-blue-200 bg-white shadow-sm overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 px-5 py-4 bg-blue-50">
            <div className="col-span-2 text-xs font-bold text-blue-700 uppercase tracking-wide">
              Rank
            </div>
            <div className="col-span-7 text-xs font-bold text-blue-700 uppercase tracking-wide">
              Name
            </div>
            <div className="col-span-3 text-xs font-bold text-blue-700 uppercase tracking-wide text-right">
              Points
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="p-6 text-sky-600">Loading leaderboard…</div>
          ) : err ? (
            <div className="p-6 text-red-600">{err}</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-sky-600">
              No leaderboard data for {prettyMonth(monthKey)}.
            </div>
          ) : (
            <div className="divide-y divide-blue-100">
              {rows.map((r) => {
                const rank = Number(r.rank || 0);
                const top3 = rank >= 1 && rank <= 3;
                const name =
                  `${r.firstName || ""} ${r.lastName || ""}`.trim() ||
                  r.name ||
                  "Unknown";

                return (
                  <div
                    key={r.userId || `${name}-${rank}`}
                    className={top3 ? "grid grid-cols-12 gap-2 px-5 py-4 items-center hover:brightness-95 transition"
                                  : "grid grid-cols-12 gap-2 px-5 py-4 items-center hover:bg-blue-50 transition"}
                  >
                    {/* Rank */}
                    <div className="col-span-2">
                      <div
                        className={
                          top3
                            ? "inline-flex items-center gap-2 rounded-2xl border border-blue-400/60 bg-blue-700 text-white shadow-sm px-3 py-1.5 font-bold"
                            : "inline-flex items-center gap-2 rounded-2xl border border-blue-200/60 bg-white text-blue-800 px-3 py-1.5 font-bold"
                        }
                      >
                        <span>{trophy(rank)}</span>
                        <span>#{rank}</span>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="col-span-7">
                      <div className={top3 ? "font-semibold text-blue-900" : "font-semibold text-blue-800"}>
                        {name}
                      </div>
                      <div className="text-xs text-sky-600">
                        {r.userId ? `User: ${String(r.userId).slice(-6)}` : ""}
                      </div>
                    </div>

                    {/* Points */}
                    <div className="col-span-3 text-right">
                      <div
                        className={
                          top3
                            ? "inline-flex justify-end rounded-2xl px-3 py-1.5 font-extrabold bg-blue-700 text-white"
                            : "inline-flex justify-end rounded-2xl px-3 py-1.5 font-extrabold bg-blue-100 text-blue-800"
                        }
                      >
                        {Number(r.points || 0)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-sky-600">
          Month: <span className="font-semibold">{prettyMonth(monthKey)}</span>
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
