export const DAY_MS = 86400000;
export const IST_MS = 19800000;
export const MIN_DATE = "1900-01-01";
export const MAX_DATE = "2100-12-31";
export const istDay = (ms) => Math.floor((ms + IST_MS) / DAY_MS);
export const dateKey = (ms = Date.now()) => new Date(ms + IST_MS).toISOString().slice(0, 10);

export function dateMillis(key) {
  if (typeof key !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  const utc = Date.parse(`${key}T00:00:00Z`);
  return Number.isFinite(utc) && new Date(utc).toISOString().slice(0, 10) === key ? utc - IST_MS : null;
}
export const validDate = (key) => dateMillis(key) != null && key >= MIN_DATE && key <= MAX_DATE;
export const addDays = (key, days) => dateKey(dateMillis(key) + days * DAY_MS);

export function shiftMonth(key, delta) {
  const [year, month, day] = key.split("-").map(Number);
  const target = new Date(Date.UTC(year, month - 1 + delta, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), Math.min(day, last))).toISOString().slice(0, 10);
}

export function monthCells(key) {
  const [year, month] = key.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const count = Math.ceil((first.getUTCDay() + days) / 7) * 7;
  return Array.from({ length: count }, (_, i) => {
    const day = i - first.getUTCDay() + 1;
    return day < 1 || day > days ? null : `${key.slice(0, 7)}-${String(day).padStart(2, "0")}`;
  });
}

const long = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long", year: "numeric" });
const short = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric" });
export const formatDate = (ms, full = false) => (full ? long : short).format(ms);

export function formatTime(ms) {
  if (!Number.isFinite(ms)) return "—";
  const date = new Date(ms + IST_MS);
  const hours = date.getUTCHours();
  return `${hours % 12 || 12}:${String(date.getUTCMinutes()).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
}
export const formatPeriod = (start, end) => `${formatTime(start)} – ${formatTime(end)}`;
