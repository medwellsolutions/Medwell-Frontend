import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const initials = (first = "", last = "") =>
  `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "?";

const FeedSlideshow = () => {
  const [items, setItems]       = useState([]);
  const [current, setCurrent]   = useState(0);
  const [loading, setLoading]   = useState(true);
  const [paused, setPaused]     = useState(false);
  const timerRef                = useRef(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/feed?page=1&limit=20`, { withCredentials: true })
      .then(({ data }) => setItems(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const goTo = useCallback((idx) => {
    setCurrent(idx);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? items.length - 1 : c - 1));
  }, [items.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === items.length - 1 ? 0 : c + 1));
  }, [items.length]);

  // Auto-advance
  useEffect(() => {
    if (paused || items.length < 2) return;
    timerRef.current = setInterval(next, 4500);
    return () => clearInterval(timerRef.current);
  }, [paused, items.length, next]);

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-extrabold text-gray-900 mb-3">Community Activity</h3>
        <div className="h-28 bg-white border border-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) return null;

  const item     = items[current];
  const user     = item.user  || {};
  const event    = item.event || {};
  const thumbUrl = item.media?.[0]?.url || null;
  const name     = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Someone";

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-extrabold text-gray-900">Community Activity</h3>
        <span className="text-xs text-gray-400">{current + 1} / {items.length}</span>
      </div>

      {/* Card */}
      <div
        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex gap-0 cursor-default select-none"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {thumbUrl && (
          <div className="shrink-0 w-24 sm:w-32">
            <img src={thumbUrl} alt="proof" className="h-full w-full object-cover" />
          </div>
        )}

        <div className="flex-1 p-4 min-w-0">
          {/* Avatar + name + time */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#e13429] text-xs font-extrabold shrink-0">
              {initials(user.firstName, user.lastName)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
              <p className="text-[11px] text-gray-400">{timeAgo(item.reviewedAt)}</p>
            </div>
          </div>

          {/* Event + step */}
          {event.name && (
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.name} className="h-4 w-4 rounded object-cover border border-gray-200" />
              )}
              <span className="text-xs font-medium text-[#e13429] truncate">{event.name}</span>
              <span className="text-[10px] text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 shrink-0">
                Step {item.stepNumber}
              </span>
            </div>
          )}

          {/* Experience */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.experience}</p>

          {item.socialLink && (
            <a
              href={item.socialLink}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#e13429] hover:underline"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View post
            </a>
          )}
        </div>

        {/* Prev / Next arrows */}
        {items.length > 1 && (
          <div className="flex flex-col justify-center gap-1 pr-3">
            <button
              onClick={prev}
              className="h-7 w-7 rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center text-gray-500"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="h-7 w-7 rounded-full border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center text-gray-500"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={[
                "rounded-full transition-all",
                i === current
                  ? "w-4 h-2 bg-[#e13429]"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400",
              ].join(" ")}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedSlideshow;
