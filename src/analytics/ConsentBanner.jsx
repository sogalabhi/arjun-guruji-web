import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { setConsent, trackPage } from "./analytics";
import { useConsent } from "./useConsent";

// Asks once whether visits may be counted. Sits above the mini player and
// doesn't block the page.
export default function ConsentBanner() {
  const consent = useConsent();
  const { pathname } = useLocation();
  if (consent || pathname === "/privacy") return null;

  return (
    <aside
      aria-label="Cookies"
      className="fixed inset-x-0 bottom-0 z-50 pb-[max(12px,env(safe-area-inset-bottom))] pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))]"
    >
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-4 text-ink shadow-2xl ring-1 ring-black/10">
        <p className="text-[16px] leading-snug">
          May we count visits to improve this site? This uses cookies from Google Analytics. Nothing is used for ads.{" "}
          <Link to="/privacy" className="font-semibold text-navy underline">Privacy</Link>
        </p>
        <div className="mt-3 flex gap-3">
          <button type="button" onClick={() => setConsent("granted")} className="min-h-tap flex-1 rounded-xl bg-navy px-4 text-[17px] font-semibold text-white active:opacity-80">
            Allow
          </button>
          <button type="button" onClick={() => setConsent("denied")} className="min-h-tap flex-1 rounded-xl border border-black/25 px-4 text-[17px] font-semibold active:bg-black/5">
            No thanks
          </button>
        </div>
      </div>
    </aside>
  );
}

// Sends a page view after each navigation (path only: search terms in ?q= are
// sent as "search" events instead). Waits a moment so the page has
// loaded its data and set its title (pages set document.title themselves).
export function PageViewTracker() {
  const { pathname } = useLocation();
  const consent = useConsent();
  useEffect(() => {
    if (consent !== "granted") return;
    const timer = setTimeout(() => trackPage(pathname, document.title), 1000);
    return () => clearTimeout(timer);
  }, [pathname, consent]);
  return null;
}
