import { useState } from "react";
import Icon from "../../components/ui/Icon";

const KEY = "ios-install-hint-dismissed";

// iPhone and iPad have no Play Store app and Safari never offers to install a
// site by itself, so explain how. Hidden once installed or dismissed.
const isIos = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isInstalled = () => navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;

function wasDismissed() {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export default function IosInstallHint() {
  const [show, setShow] = useState(() => isIos() && !isInstalled() && !wasDismissed());
  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // Private mode: the hint just comes back next visit.
    }
  };

  return (
    <aside aria-label="Add to Home Screen" className="mt-5 flex items-start gap-3 rounded-2xl border border-white/25 bg-white/10 p-4">
      <span className="mt-0.5 shrink-0 text-tile"><Icon name="share" size={26} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-semibold">Add Arjun Guruji to your Home Screen</p>
        <p className="mt-1 text-[16px] text-white/85">
          Tap <span className="font-semibold">Share</span>, then <span className="font-semibold">Add to Home Screen</span>.
        </p>
      </div>
      <button type="button" onClick={dismiss} aria-label="Close" className="-mr-2 -mt-2 flex min-h-tap min-w-tap shrink-0 items-center justify-center rounded-full active:bg-white/15">
        <Icon name="close" size={22} />
      </button>
    </aside>
  );
}
