import { dateMillis, validDate } from "./dates.js";

let pending;
export function loadPanchang() {
  if (pending) return pending;
  pending = import("./panchangEngine.js").then((module) => module.default).catch(() => {
    pending = undefined;
    const error = new Error("Panchang could not load. Please check your connection and try again.");
    error.name = "PanchangLoadError";
    throw error;
  });
  return pending;
}

const cache = new Map();
export async function getPanchang(date, city, detailed = false) {
  if (!validDate(date) || dateMillis(date) == null) throw new Error("Choose a date between 1900 and 2100.");
  const engine = await loadPanchang();
  const key = `${date}:${city}${detailed ? ":details" : ""}`;
  if (!cache.has(key)) {
    const [year, month, day] = date.split("-").map(Number);
    const info = engine.getForDate(year, month, day, city, detailed);
    if (!info) throw new Error("Panchang is unavailable for this city. Please choose a city from the list.");
    if (cache.size >= 64) cache.delete(cache.keys().next().value);
    cache.set(key, info);
  }
  return { key, info: cache.get(key), cities: engine.cities() };
}
