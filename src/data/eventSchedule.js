import { DAY_MS as DAY, IST_MS as IST, istDay as dayOf, dateMillis } from "./dates.js";
import { toSlug } from "./search.js";
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
export const eventPath = (event) => `/events/${encodeURIComponent(event.slug || event.id)}`;

// Gives each event a link in English letters, so shared links don't turn into
// %E0%B2... strings: the title plus the start date ("shri-mahaganapati-homa-2025-09-22"),
// or just the title for weekly programmes. Digits in the title are dropped since
// the date is added. Repeated slugs get -2, -3 in id order so they stay stable.
export function withSlugs(events) {
  const taken = new Map();
  const slugs = new Map();
  for (const event of [...events].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))) {
    const name = toSlug(event.title.replace(/[0-9೦-೯]+/g, " "));
    const date = new Date(dayOf(event.start) * DAY).toISOString().slice(0, 10);
    const base = !name ? toSlug(event.id) || "event" : event.frequency === "weekly" ? name : `${name}-${date}`;
    const count = (taken.get(base) ?? 0) + 1;
    taken.set(base, count);
    slugs.set(event, count === 1 ? base : `${base}-${count}`);
  }
  return events.map((event) => ({ ...event, slug: slugs.get(event) }));
}

// Finds an event by its slug, or by its Firestore id so links shared before slugs still work.
export const findEvent = (events, key) =>
  events.find((event) => event.slug === key) ?? events.find((event) => event.id === key) ?? null;
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
    gallery: Array.isArray(data.galleryLinks) ? data.galleryLinks.map(publicUrl).filter(Boolean) : [],
    imageUrl: publicUrl(data.imageUrl), mapUrl: publicUrl(data.mapUrl) || publicUrl(data.venue),
    activities: Array.isArray(data.activities) ? data.activities.filter((a) => a && typeof a === "object").map((a) => ({ time: text(a.time), activity: text(a.activity), venue: text(a.venue) })).filter((a) => a.activity) : [],
    tags: Array.isArray(data.tags) ? data.tags.map(text).filter(Boolean) : [],
  };
}

// One-off programmes running right now: timed events between their start and end,
// and date-only events on any of their days. Weekly programmes have no times, so
// they're never "happening now"; Home shows them as today's programme instead.
export function happeningNow(events, now = Date.now()) {
  const today = dayOf(now);
  return events
    .filter((event) => {
      if (event.type === "recurring" || ["cancelled", "canceled", "completed", "past"].includes(event.status)) return false;
      return dateOnlyEvent(event) ? dayOf(event.start) <= today && today <= dayOf(event.end) : event.start <= now && now < event.end;
    })
    .sort((a, b) => a.start - b.start || a.id.localeCompare(b.id))
    .map((event) => ({ ...event, live: true, dateOnly: dateOnlyEvent(event) }));
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
