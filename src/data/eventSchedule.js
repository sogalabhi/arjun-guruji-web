import { DAY_MS as DAY, IST_MS as IST, istDay as dayOf, dateMillis } from "./dates.js";
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const text = (value) => typeof value === "string" ? value.trim() : "";
const isMidnight = (ms) => Math.floor(((ms + IST) % DAY) / 60000) === 0;

function timestamp(value) {
  if (value == null) return null;
  const ms = typeof value.toMillis === "function" ? value.toMillis()
    : value instanceof Date ? value.getTime()
    : typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(ms) ? ms : null;
}

export function publicUrl(value) {
  try {
    const url = new URL(text(value));
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
}

export const isVideoUrl = (url) => /(?:youtube\.com|youtu\.be|vimeo\.com|\.(?:mp4|webm)(?:[?#]|$))/i.test(url);
export const eventPath = (id) => `/events/${encodeURIComponent(id)}`;
export const cancelled = (event) => ["cancelled", "canceled"].includes(event.status);
export const dateOnlyEvent = (event) => isMidnight(event.start) && isMidnight(event.end);

export function nextWeeklyOccurrence(event, from = Date.now()) {
  const weekday = WEEKDAYS.indexOf(event.day);
  if (event.frequency !== "weekly" || weekday < 0) return null;
  const firstDay = Math.max(dayOf(from), dayOf(event.start));
  const occurrenceDay = firstDay + (weekday - new Date(firstDay * DAY).getUTCDay() + 7) % 7;
  return occurrenceDay > dayOf(event.end) ? null : occurrenceDay * DAY - IST;
}

export function mapEvent(id, data) {
  const start = timestamp(data.startDate);
  const end = timestamp(data.endDate) ?? start;
  const title = text(data.title);
  // Malformed test records should not hide valid programmes.
  if (!title || (title === id && /^[A-Za-z0-9]{20}$/.test(id)) || start == null || end == null || end < start) return null;
  return {
    id, title, start, end,
    type: text(data.eventType).toLowerCase(),
    frequency: text(data.frequency).toLowerCase(),
    day: text(data.day).toLowerCase(),
    status: text(data.status).toLowerCase(),
    venue: text(data.venue), city: text(data.city), place: text(data.place),
    description: text(data.description), guest: text(data.guest),
    featured: data.isFeatured === true || text(data.eventType).toLowerCase() === "featured",
    interestedCount: typeof data.interestedCount === "number" && Number.isFinite(data.interestedCount) ? Math.max(0, Math.floor(data.interestedCount)) : 0,
    gallery: Array.isArray(data.galleryLinks) ? data.galleryLinks.map(publicUrl).filter(Boolean) : [],
    imageUrl: publicUrl(data.imageUrl), mapUrl: publicUrl(data.mapUrl) || publicUrl(data.venue),
    activities: Array.isArray(data.activities) ? data.activities.filter((a) => a && typeof a === "object").map((a) => ({ time: text(a.time), activity: text(a.activity), venue: text(a.venue) })).filter((a) => a.activity) : [],
    tags: Array.isArray(data.tags) ? data.tags.map(text).filter(Boolean) : [],
  };
}

export function nextProgramme(events, now = Date.now()) {
  const today = dayOf(now);
  const candidates = [];
  for (const event of events) {
    if (["cancelled", "canceled", "completed", "past"].includes(event.status) || dayOf(event.end) < today) continue;

    if (event.type === "recurring") {
      // A recurring document's dates bound its schedule; they are not a
      // single event running continuously between those dates.
      const occurrence = nextWeeklyOccurrence(event, now);
      if (occurrence == null) continue;
      candidates.push({ ...event, occurrence, today: dayOf(occurrence) === today, recurring: true });
    } else {
      const dateOnly = dateOnlyEvent(event);
      if (!dateOnly && event.end < now) continue;
      candidates.push({ ...event, occurrence: event.start, today: dayOf(event.start) <= today, recurring: false, dateOnly });
    }
  }
  candidates.sort((a, b) => Number(b.today) - Number(a.today) || a.occurrence - b.occurrence || a.id.localeCompare(b.id));
  return candidates[0] ?? null;
}

export function groupEvents(events, now = Date.now()) {
  const today = dayOf(now);
  const groups = { happening: [], weekly: [], upcoming: [], past: [] };
  for (const event of events) {
    if (dayOf(event.end) < today) groups.past.push(event);
    else if (dayOf(event.start) > today) groups.upcoming.push(event);
    else if (event.type === "recurring") groups.weekly.push(event);
    else groups.happening.push(event);
  }
  groups.past.sort((a, b) => b.end - a.end);
  groups.happening.sort((a, b) => a.start - b.start);
  for (const key of ["weekly", "upcoming"]) groups[key].sort((a, b) => (a.type === "recurring" ? nextWeeklyOccurrence(a, now) ?? a.start : a.start) - (b.type === "recurring" ? nextWeeklyOccurrence(b, now) ?? b.start : b.start));
  return groups;
}

export function eventsOnDate(events, key) {
  const date = dateMillis(key);
  if (date == null) return [];
  const day = dayOf(date);
  return events.filter((event) => {
    if (day < dayOf(event.start) || day > dayOf(event.end)) return false;
    if (event.type !== "recurring") return true;
    return event.frequency === "weekly" && WEEKDAYS[new Date(day * DAY).getUTCDay()] === event.day;
  }).sort((a, b) => a.start - b.start);
}
