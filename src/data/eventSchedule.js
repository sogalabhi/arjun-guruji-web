const DAY = 24 * 60 * 60 * 1000;
const IST = (5 * 60 + 30) * 60 * 1000;
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const text = (value) => typeof value === "string" ? value.trim() : "";
const dayOf = (ms) => Math.floor((ms + IST) / DAY);
const isMidnight = (ms) => Math.floor(((ms + IST) % DAY) / 60000) === 0;

function timestamp(value) {
  if (value == null) return null;
  const ms = typeof value.toMillis === "function" ? value.toMillis()
    : value instanceof Date ? value.getTime()
    : typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(ms) ? ms : null;
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
    venue: text(data.venue), city: text(data.city),
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
      const weekday = WEEKDAYS.indexOf(event.day);
      if (event.frequency !== "weekly" || weekday < 0) continue;
      const firstDay = Math.max(today, dayOf(event.start));
      const firstWeekday = new Date(firstDay * DAY).getUTCDay();
      const occurrenceDay = firstDay + (weekday - firstWeekday + 7) % 7;
      if (occurrenceDay > dayOf(event.end)) continue;
      candidates.push({ ...event, occurrence: occurrenceDay * DAY - IST, today: occurrenceDay === today, recurring: true });
    } else {
      const dateOnly = isMidnight(event.start) && isMidnight(event.end);
      if (!dateOnly && event.end < now) continue;
      candidates.push({ ...event, occurrence: event.start, today: dayOf(event.start) <= today, recurring: false, dateOnly });
    }
  }
  candidates.sort((a, b) => Number(b.today) - Number(a.today) || a.occurrence - b.occurrence || a.id.localeCompare(b.id));
  return candidates[0] ?? null;
}
