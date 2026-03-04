import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const AdminEventSubmissionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("pending");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  const [openId, setOpenId] = useState(null);

  const [rejectComments, setRejectComments] = useState({});
  const [hoursAwarded, setHoursAwarded] = useState({});

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

  const userOptions = useMemo(() => {
    const map = new Map();

    submissions.forEach((s) => {
      if (s.user?._id) {
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
        map.set(s.event._id, `${s.event.name || "Event"} • ${s.event.month || ""}`);
      }
    });
    return Array.from(map.entries());
  }, [submissions]);

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
    <div className="min-h-screen bg-[#f8fafc] px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Event Submissions Review
            </h1>
            <p className="text-sm mt-1 text-gray-600">
              Click a submission to expand and review.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-start md:justify-end">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm min-w-[240px]"
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
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm min-w-[240px]"
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
              className="h-11 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center mt-10">
            <span className="loading loading-spinner loading-lg text-[#e13429]"></span>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-700">
            No submissions found.
          </div>
        )}

        <div className="space-y-4 max-w-4xl mx-auto mt-6">
          {submissions.map((s) => {
            const isOpen = openId === s._id;

            const fullName = `${s.user?.firstName || ""} ${s.user?.lastName || ""}`
              .trim()
              .replace(/\s+/g, " ");

            return (
              <div
                key={s._id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : s._id)}
                  className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50 transition"
                >
                  <div className="text-left">
                    <p className="font-semibold text-[15px] text-gray-900">
                      {s.event?.name}
                      <span className="text-gray-500 font-normal"> • {s.event?.month}</span>
                    </p>

                    <p className="text-sm mt-1 text-gray-800">
                      <span className="opacity-70">👤</span>{" "}
                      <span className="font-medium">{fullName || "Unknown User"}</span>
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      ✉️ {s.user?.emailId || "No email"} • Step {s.stepNumber}
                    </p>
                  </div>

                  <span className="text-xl text-[#e13429]">{isOpen ? "▴" : "▾"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-200 px-5 py-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Proof</h3>

                      {s.proofImageUrl ? (
                        <a href={s.proofImageUrl} target="_blank" rel="noreferrer">
                          <img
                            src={s.proofImageUrl}
                            className="w-full h-64 object-cover rounded-xl border border-gray-200 bg-white"
                            alt="Proof"
                          />
                          <p className="text-xs text-gray-500 mt-2 underline">
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
                          className="block mt-3 text-[#e13429] underline break-all text-sm"
                        >
                          {s.socialLink}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-600 mt-3">
                          No social link provided
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>

                      <div className="rounded-xl bg-[#f8fafc] border border-gray-200 p-4">
                        <p className="text-sm whitespace-pre-wrap text-gray-800">
                          {s.experience}
                        </p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-gray-800">
                          Hours (optional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={hoursAwarded[s._id] ?? ""}
                          placeholder="0"
                          className="h-11 w-40 rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e13429]/25"
                          onChange={(e) =>
                            setHoursAwarded((p) => ({
                              ...p,
                              [s._id]: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-1 text-gray-800">
                          Rejection comment (required if rejecting)
                        </label>
                        <textarea
                          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e13429]/25"
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

                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => approveSubmission(s._id)}
                          className="flex-1 h-11 rounded-full bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-md"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectSubmission(s._id)}
                          className="flex-1 h-11 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 font-medium transition"
                        >
                          Reject
                        </button>
                      </div>

                      <button
                        onClick={() => setOpenId(null)}
                        className="mt-4 text-sm underline text-gray-500 hover:text-[#e13429] transition"
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
    </div>
  );
};

export default AdminEventSubmissionsPage;
