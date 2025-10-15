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

export default function ErrorPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const status = Number(state?.status) || 500;
  const preset = PRESETS[status] ?? PRESETS[500];

  const title = state?.title || preset.title;
  const message = state?.message || preset.message;
  const reason = state?.reason; // e.g., "application", "profile", etc.

  // Smart primary CTA based on reason (customize as needed)
  const primaryCTA =
    reason === "application"
      ? { href: "/admin/applications", label: "Back to Applications" }
      : { href: "/", label: "Home" };

  return (
    <main className="min-h-[70vh] grid place-items-center px-6">
      <div className="w-full max-w-xl text-center">
        <p className="text-7xl font-extrabold tracking-tight">{status}</p>
        <h1 className="mt-2 text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm opacity-70">{message}</p>

        {/* Optional extra details from state (kept generic & safe) */}
        {state?.details && (
          <div className="mt-4 text-left mx-auto max-w-md">
            <div className="text-xs font-semibold opacity-70 mb-1">Details</div>
            <pre className="text-xs bg-gray-50 rounded p-3 overflow-auto">
              {typeof state.details === "string"
                ? state.details
                : JSON.stringify(state.details, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 flex gap-3 justify-center">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <button className="btn" onClick={() => navigate(0)}>
            Retry
          </button>
          <Link className="btn btn-primary" to={primaryCTA.href}>
            {primaryCTA.label}
          </Link>
        </div>
      </div>
    </main>
  );
}
