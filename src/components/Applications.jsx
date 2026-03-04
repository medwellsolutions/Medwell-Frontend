import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function format12HourTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `Sent request at ${hours} ${ampm} ${month}/${day}/${year}`;
}

const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${BASE_URL}/admin/applications`, {
          withCredentials: true,
        });

        setApplications(res?.data?.data || []);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (applicant) => {
    navigate(`/home/admin/application/${applicant._id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900">Applications</h2>
          <p className="mt-2 text-sm text-gray-600">
            Review pending applications and view details.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg text-[#e13429]"></span>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <ul className="bg-white rounded-2xl shadow-xl border border-gray-200 divide-y divide-gray-200">
            {applications.map((applicant) => (
              <li
                key={applicant._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-8 py-6 transition hover:bg-gray-50"
              >
                <div>
                  <div className="font-bold text-2xl text-gray-900">
                    {applicant.firstName} {applicant.lastName}
                  </div>

                  <div className="text-sm font-semibold uppercase mt-1 text-[#e13429]">
                    Role: {applicant.role}
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    {format12HourTime(applicant.createdAt)}
                  </div>
                </div>

                <button
                  className="px-8 h-11 rounded-full border border-[#e13429] text-[#e13429] hover:bg-[#e13429] hover:text-white transition font-medium"
                  onClick={() => handleView(applicant)}
                >
                  View
                </button>
              </li>
            ))}

            {applications.length === 0 && (
              <li className="py-10 text-center">
                <p className="text-gray-600 text-lg">No applications found.</p>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Applications;
