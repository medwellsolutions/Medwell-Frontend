// ErrorPage.jsx
import { useLocation, useNavigate, Link } from "react-router-dom";

const PRESETS = {
  400: { title: "Bad Request", message: "Your request was invalid. Check and try again." },
  401: { title: "Unauthorized", message: "Please sign in to continue." },
  403: { title: "Forbidden", message: "You don’t have permission to access this resource." },
  404: { title: "Not Found", message: "The page or item you’re looking for doesn’t exist." },
  409: { title: "Conflict", message: "There’s a conflict with the current resource state." },
  422: { title: "Unprocessable Entity", message: "We couldn’t process the submitted data." },
  429: { title: "Too Many Requests", message: "You’ve hit the rate limit. Please try again later." },
  500: { title: "Server Error", message: "Something went wrong on our end. Please try again." },
  503: { title: "Service Unavailable", message: "Service is temporarily unavailable. Try again soon." },
};

const severityStyles = (status) => {
  if (status >= 500) {
    return { pill: "bg-red-50 border-red-200 text-[#e13429]" };
  }
  if (status === 404 || status === 429) {
    return { pill: "bg-amber-50 border-amber-200 text-amber-700" };
  }
  if (status === 401) {
    return { pill: "bg-blue-50 border-blue-200 text-blue-700" };
  }
  return { pill: "bg-red-50 border-red-200 text-[#e13429]" };
};

export default function ErrorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const status = Number(state?.status) || 500;
  const preset = PRESETS[status] ?? PRESETS[500];

  const title = state?.title || preset.title;
  const message = state?.message || preset.message;
  const reason = state?.reason;

  const primaryCTA =
    reason === "application"
      ? { href: "/admin/applications", label: "Back to Applications" }
      : { href: "/", label: "Home" };

  const { pill } = severityStyles(status);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-12 grid place-items-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 sm:p-10 text-center relative overflow-hidden">
          {/* subtle blobs */}
          <div className="absolute -top-20 -right-24 w-72 h-72 rounded-full blur-3xl opacity-60 bg-[#e13429]/10" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-60 bg-sky-500/10" />

          <div className="relative">
            <div className="inline-flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${pill}`}
              >
                {status}
              </span>
              <span className="text-sm text-gray-500">Something happened</span>
            </div>

            <p className="mt-4 text-7xl sm:text-8xl font-extrabold tracking-tight text-gray-900">
              {status}
            </p>

            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
              {title}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-600">
              {message}
            </p>

            {/* Optional details */}
            {state?.details && (
              <div className="mt-6 text-left mx-auto max-w-xl">
                <div className="text-xs font-semibold text-gray-700 mb-2">Details</div>
                <pre className="text-xs bg-[#f8fafc] border border-gray-200 rounded-2xl p-4 overflow-auto text-gray-700">
                  {typeof state.details === "string"
                    ? state.details
                    : JSON.stringify(state.details, null, 2)}
                </pre>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="h-12 rounded-full px-6 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>

              <button
                className="h-12 rounded-full px-6 border border-[#e13429] text-[#e13429] hover:bg-red-50 transition"
                onClick={() => navigate(0)}
              >
                Retry
              </button>

              <Link
                className="h-12 rounded-full px-6 inline-flex items-center justify-center bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-md"
                to={primaryCTA.href}
              >
                {primaryCTA.label}
              </Link>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              If this keeps happening, contact support with the status code.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}