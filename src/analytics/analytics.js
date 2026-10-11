import { app } from "../firebase";

// Usage statistics with Firebase (Google) Analytics, only after the visitor
// allows it. Until then nothing is loaded and no cookies are set. Advertising
// features are off. The choice is kept per browser and can be changed in Settings.

const KEY = "analytics-consent"; // "granted" | "denied"
const MEASUREMENT_ID = "G-HJ42C2H32F";
const listeners = new Set();
let consent = readConsent();
let loading; // Promise of { analytics, sdk } once started
let queue = [];

function readConsent() {
  try {
    const value = localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export const getConsent = () => consent;

export function subscribeConsent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setConsent(value) {
  consent = value;
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Private mode: the choice lasts for this visit only.
  }
  listeners.forEach((listener) => listener(value));
  if (value === "granted") startAnalytics();
  else stopAnalytics();
}

// Loads the SDK in its own chunk, so visitors who decline never download it.
export function startAnalytics() {
  if (consent !== "granted") return;
  if (loading) {
    loading.then((ready) => ready && ready.sdk.setAnalyticsCollectionEnabled(ready.analytics, true));
    return;
  }
  loading = import("firebase/analytics")
    .then(async (sdk) => {
      if (!(await sdk.isSupported())) return null;
      sdk.setConsent({
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      const analytics = sdk.initializeAnalytics(app, {
        config: {
          send_page_view: false, // sent by trackPage once the page title is set
          allow_google_signals: false,
          allow_ad_personalization_signals: false,
        },
      });
      const ready = { analytics, sdk };
      queue.forEach(([name, params]) => sdk.logEvent(analytics, name, params));
      queue = [];
      return ready;
    })
    .catch(() => null);
}

function stopAnalytics() {
  queue = [];
  loading?.then((ready) => ready && ready.sdk.setAnalyticsCollectionEnabled(ready.analytics, false));
  // Remove the cookies Analytics may already have set.
  for (const name of ["_ga", `_ga_${MEASUREMENT_ID.slice(2)}`]) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}`;
  }
}

export function trackEvent(name, params = {}) {
  if (consent !== "granted") return;
  if (!loading) {
    queue.push([name, params]);
    return;
  }
  loading.then((ready) => {
    if (ready && consent === "granted") ready.sdk.logEvent(ready.analytics, name, params);
  });
}

export function trackPage(path, title) {
  trackEvent("page_view", {
    page_path: path,
    page_location: location.origin + path,
    page_title: title,
  });
}
