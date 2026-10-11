import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Same settings and defaults as the app (settings_entity.dart): light theme,
// size 20, sans-serif. Stored per device.
// eslint-disable-next-line react-refresh/only-export-components
export const FONT_STEPS = [16, 18, 20, 22, 25, 28, 32];
// eslint-disable-next-line react-refresh/only-export-components
export const THEMES = ["light", "sepia", "dark"];
const KEY = "reader-settings";
const DEFAULTS = { theme: "light", fontSize: 20, fontStyle: "sans-serif" };

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (v && THEMES.includes(v.theme) && typeof v.fontSize === "number") return { ...DEFAULTS, ...v };
  } catch {
    // ignore
  }
  return DEFAULTS;
}

const Ctx = createContext(null);

export function ReaderSettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);
  const update = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), []);
  return <Ctx.Provider value={{ settings, update }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReaderSettings() {
  return useContext(Ctx);
}

// Snap any stored size to the nearest step.
// eslint-disable-next-line react-refresh/only-export-components
export function stepIndex(size) {
  let best = 0;
  FONT_STEPS.forEach((s, i) => {
    if (Math.abs(s - size) < Math.abs(FONT_STEPS[best] - size)) best = i;
  });
  return best;
}
