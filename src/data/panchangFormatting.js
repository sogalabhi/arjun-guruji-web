import { dateMillis, DAY_MS, IST_MS } from "./dates.js";

export function panchangTime(ms, date, extended = true, language = "kn") {
  if (!Number.isFinite(ms)) return "—";
  const start = dateMillis(date);
  if (start == null) return "—";
  const seconds = Math.floor((ms - start) / 1000);
  const offset = Math.floor(seconds / (DAY_MS / 1000));
  const clock = new Date(ms + IST_MS);
  const hours = extended && offset >= 0 ? Math.floor(seconds / 3600) : clock.getUTCHours();
  const value = `${String(hours).padStart(2, "0")}:${String(clock.getUTCMinutes()).padStart(2, "0")}:${String(clock.getUTCSeconds()).padStart(2, "0")}`;
  const suffix = offset === 0 ? "" : offset === 1 ? (language === "kn" ? "ಮರುದಿನ" : "next day") : offset === -1 ? (language === "kn" ? "ಹಿಂದಿನ ದಿನ" : "previous day") : (language === "kn" ? `${offset > 0 ? "+" : ""}${offset} ದಿನ` : `${offset > 0 ? "+" : ""}${offset} days`);
  return suffix ? `${value} (${suffix})` : value;
}

export function panchangDuration(ms, language = "kn") {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const total = Math.round(ms / 1000);
  const units = language === "kn" ? ["ಗಂ", "ನಿ", "ಸೆ"] : ["h", "m", "s"];
  return `${Math.floor(total / 3600)} ${units[0]} ${Math.floor(total / 60) % 60} ${units[1]} ${total % 60} ${units[2]}`;
}
