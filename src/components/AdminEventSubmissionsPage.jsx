import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const AdminEventSubmissionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  // filters
  const [status, setStatus] = useState("pending");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  // accordion
  const [openId, setOpenId] = useState(null);

  // inputs
  const [rejectComments, setRejectComments] = useState({});
  const [hoursAwarded, setHoursAwarded] = useState({});

  // ========================
  // FETCH SUBMISSIONS
  // ========================
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(`${BASE_URL}/admin/event/submission`, {
        params: {
          status,
          ...(selectedUser ? { user: selectedUser } : {}),
          ...(selectedEvent ? { event: selectedEvent } : {}),
          page: 1,
          limit: 100,
        },
        withCredentials: true,
      });

      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, selectedUser, selectedEvent]);

  // ========================
  // FILTER OPTIONS
  // ========================
  const userOptions = useMemo(() => {
    const map = new Map();

    submissions.forEach((s) => {
      if (s.user._id) {
        const fullName = `${s.user.firstName || ""} ${s.user?.lastName || ""}`
          .trim()
          .replace(/\s+/g, " ");

        const label = `${fullName || "User"} (${s.user?.emailId || "no-email"})`;

        map.set(s.user._id, label);
      }
    });

    return Array.from(map.entries());
  }, [submissions]);

  const eventOptions = useMemo(() => {
    const map = new Map();
    submissions.forEach((s) => {
      if (s.event?._id) {
        map.set(
          s.event._id,
          `${s.event.name || "Event"} • ${s.event.month || ""}`
        );
      }
    });
    return Array.from(map.entries());
  }, [submissions]);

  // ========================
  // REVIEW ACTIONS
  // ========================
  const approveSubmission = async (id) => {
    try {
      await axios.patch(
        `${BASE_URL}/admin/event/${id}/review`,
        {
          action: "approved",
          hoursAwarded: Number(hoursAwarded[id] || 0),
        },
        { withCredentials: true }
      );

      // remove immediately from list
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setOpenId(null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to approve submission");
    }
  };

  const rejectSubmission = async (id) => {
    const comment = (rejectComments[id] || "").trim();
    if (!comment) {
      alert("Rejection comment is required");
      return;
    }

    try {
      await axios.patch(
        `${BASE_URL}/admin/event/${id}/review`,
        {
          action: "rejected",
          reviewComment: comment,
        },
        { withCredentials: true }
      );

      setSubmissions((prev) => prev.filter((s) => s._id !== id));
      setOpenId(null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to reject submission");
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-6">
      {/* HEADER + FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Event Submissions Review</h1>
          <p className="text-sm text-gray-600">
            Click a submission to expand and review.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-start md:justify-end">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm min-w-[220px]"
          >
            <option value="">All Users</option>
            {userOptions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm min-w-[240px]"
          >
            <option value="">All Events</option>
            {eventOptions.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedUser("");
              setSelectedEvent("");
            }}
            className="border px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* STATES */}
      {loading && <p className="text-center mt-10">Loading...</p>}
      {error && <p className="text-center mt-10 text-red-600">{error}</p>}
      {!loading && !error && submissions.length === 0 && (
        <p className="text-center mt-10 text-gray-600">No submissions found.</p>
      )}

      {/* LIST (HALF WIDTH + CENTERED) */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {submissions.map((s) => {
          const isOpen = openId === s._id;

          const fullName = `${s.user?.firstName || ""} ${s.user?.lastName || ""}`
            .trim()
            .replace(/\s+/g, " ");

          return (
            <div key={s._id} className="border rounded-xl overflow-hidden">
              {/* BAR */}
              <button
                onClick={() => setOpenId(isOpen ? null : s._id)}
                className="w-full flex justify-between items-center px-4 py-4 hover:bg-gray-50"
              >
                <div className="text-left">
                  <p className="font-semibold text-[15px]">
                    {s.event?.name}
                    <span className="text-gray-500 font-normal">
                      {" "}
                      • {s.event?.month}
                    </span>
                  </p>

                  <p className="text-sm text-gray-700 mt-0.5">
                    👤 {fullName || "Unknown User"}
                  </p>

                  <p className="text-xs text-gray-500">
                    ✉️ {s.user?.emailId || "No email"} • Step {s.stepNumber}
                  </p>
                </div>

                <span className="text-lg text-gray-500">
                  {isOpen ? "▴" : "▾"}
                </span>
              </button>

              {/* EXPANDED */}
              {isOpen && (
                <div className="border-t px-4 py-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Proof */}
                  <div>
                    <h3 className="font-semibold mb-2">Proof</h3>

                    {s.proofImageUrl ? (
                      <a
                        href={s.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={s.proofImageUrl}
                          className="w-full h-64 object-cover rounded-lg border"
                          alt="Proof"
                        />
                        <p className="text-xs text-gray-500 mt-1 underline">
                          Open image in new tab
                        </p>
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600">No image uploaded</p>
                    )}

                    {s.socialLink ? (
                      <a
                        href={s.socialLink}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-2 text-indigo-600 underline break-all text-sm"
                      >
                        {s.socialLink}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600 mt-2">
                        No social link provided
                      </p>
                    )}
                  </div>

                  {/* Experience + Actions */}
                  <div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p className="text-sm whitespace-pre-wrap mb-4 text-gray-800">
                      {s.experience}
                    </p>

                    {/* Hours */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Hours (optional)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={hoursAwarded[s._id] ?? ""}
                        placeholder="0"
                        className="border px-3 py-2 rounded-lg text-sm w-40"
                        onChange={(e) =>
                          setHoursAwarded((p) => ({
                            ...p,
                            [s._id]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Reject comment */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium mb-1">
                        Rejection comment (required if rejecting)
                      </label>
                      <textarea
                        className="border w-full px-3 py-2 rounded-lg text-sm"
                        rows={3}
                        value={rejectComments[s._id] ?? ""}
                        placeholder="Explain why you are rejecting..."
                        onChange={(e) =>
                          setRejectComments((p) => ({
                            ...p,
                            [s._id]: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveSubmission(s._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectSubmission(s._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>

                    {/* Collapse */}
                    <button
                      onClick={() => setOpenId(null)}
                      className="mt-4 text-sm underline text-gray-600 hover:text-black"
                    >
                      Collapse
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminEventSubmissionsPage;
