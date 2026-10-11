import { useNavigate } from "react-router-dom";

// Same look as the app's GradientAppBar: navy→royal gradient, white title,
// Samarkan only for the "Arjun Guruji" home title.
export default function AppBar({ title, back = true, backTo = "/", actions = null }) {
  const navigate = useNavigate();
  const isHome = title === "Arjun Guruji";

  const goBack = () => {
    // Opened directly from a shared link: there is no history to go back to.
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(backTo);
  };

  return (
    <header className="sticky top-0 z-30 bg-app-bar text-white pt-safe-t pl-safe-l pr-safe-r shadow-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-2">
        {back && <div className="flex w-12 shrink-0 justify-start">
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="flex min-h-tap min-w-tap items-center justify-center rounded-full active:bg-white/15"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
        </div>}
        <h1 className={`min-w-0 flex-1 truncate ${isHome ? "pl-2 text-left font-samarkan text-3xl leading-none sm:text-4xl" : "text-center text-xl"}`}>
          {title}
        </h1>
        <div className="flex min-w-12 shrink-0 justify-end">{actions}</div>
      </div>
    </header>
  );
}
