/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
import { dateKey, dateMillis, formatTime, monthCells, shiftMonth, validDate } from "../src/data/dates.js";
import { eventsOnDate, groupEvents, mapEvent, nextWeeklyOccurrence, publicUrl } from "../src/data/eventSchedule.js";

const event = (id, start, end, extra = {}) => mapEvent(id, { title: id, startDate: start, endDate: end, ...extra });
const now = Date.parse("2026-10-11T06:00:00Z");
test("every event has a group, including multi-day and recently ended programmes", () => {
  const records = [
    event("ongoing", "2026-10-09T18:30:00Z", "2026-10-11T18:30:00Z"),
    event("recent", "2026-10-08T18:30:00Z", "2026-10-09T18:30:00Z"),
    event("future", "2026-10-12T18:30:00Z", "2026-10-12T18:30:00Z"),
    event("weekly", "2026-01-01", "2030-12-31", { eventType: "Recurring", frequency: "weekly", day: "Thursday" }),
    event("expired", "2026-01-01", "2026-10-09T18:30:00Z", { eventType: "Recurring", frequency: "weekly", day: "Thursday" }),
  ];
  const groups = groupEvents(records, now);
  assert.deepEqual(groups.happening.map((e) => e.id), ["ongoing"]);
  assert.deepEqual(groups.weekly.map((e) => e.id), ["weekly"]);
  assert.deepEqual(groups.upcoming.map((e) => e.id), ["future"]);
  assert.deepEqual(new Set(groups.past.map((e) => e.id)), new Set(["recent", "expired"]));
  assert.equal(Object.values(groups).flat().length, records.length);
});
test("calendar shows overlapping days and bounded weekly occurrences", () => {
  const multi = event("multi", "2026-10-09T18:30:00Z", "2026-10-11T18:30:00Z");
  const weekly = event("weekly", "2026-10-01T18:30:00Z", "2026-10-15T18:30:00Z", { eventType: "Recurring", frequency: "weekly", day: "Thursday" });
  assert.deepEqual(eventsOnDate([multi, weekly], "2026-10-11").map((e) => e.id), ["multi"]);
  assert.deepEqual(eventsOnDate([multi], "2026-10-12").map((e) => e.id), ["multi"]);
  assert.equal(eventsOnDate([multi], "2026-10-13").length, 0);
  assert.equal(eventsOnDate([weekly], "2026-10-15").length, 1);
  assert.equal(eventsOnDate([weekly], "2026-10-22").length, 0);
  assert.equal(nextWeeklyOccurrence(weekly, Date.parse("2026-09-01")), dateMillis("2026-10-08"));
  assert.equal(nextWeeklyOccurrence(weekly, Date.parse("2026-10-15T07:00Z")), dateMillis("2026-10-15"));
  assert.equal(eventsOnDate([multi], "garbage").length, 0);
});
test("cancelled events remain visible in exactly one group", () => {
  const cancelled = event("cancelled", "2026-10-09", "2026-10-12", { status: "Cancelled" });
  assert.deepEqual(groupEvents([cancelled], now).happening, [cancelled]);
  assert.deepEqual(eventsOnDate([cancelled], "2026-10-11"), [cancelled]);
});
test("IST boundaries and time labels do not depend on host timezone", () => {
  assert.equal(dateKey(Date.parse("2026-10-10T18:30:00Z")), "2026-10-11");
  assert.equal(dateKey(Date.parse("2026-10-10T18:29:59Z")), "2026-10-10");
  assert.equal(formatTime(dateMillis("2026-03-08")), "12:00 AM");
  assert.equal(formatTime(Date.parse("2026-03-08T06:30:00Z")), "12:00 PM");
});
test("calendar padding, leap days, month changes and invalid date ranges", () => {
  const feb = monthCells("2024-02-29");
  assert.equal(feb.length % 7, 0);
  assert.equal(feb.filter(Boolean).length, 29);
  assert.equal(feb[4], "2024-02-01");
  assert.equal(shiftMonth("2024-01-31", 1), "2024-02-29");
  assert.equal(shiftMonth("2026-01-31", 1), "2026-02-28");
  assert.equal(shiftMonth("2026-01-31", -1), "2025-12-31");
  assert.equal(validDate("2026-02-30"), false);
  assert.equal(validDate("1800-01-01"), false);
  assert.equal(validDate("2100-12-31"), true);
});
test("event links and media accept only public HTTP URLs", () => {
  assert.equal(publicUrl("javascript:alert(1)"), "");
  assert.equal(publicUrl("data:text/html,hi"), "");
  const record = event("safe", "2026-10-11", "2026-10-11", { galleryLinks: [null, "javascript:alert(1)", "https://example.org/photo.jpg"], interestedCount: -3, activities: [null, { time: "10 AM", activity: "Bhajans", venue: "Ashrama" }, {}] });
  assert.deepEqual(record.gallery, ["https://example.org/photo.jpg"]);
  assert.equal(record.interestedCount, 0);
  assert.equal(record.activities.length, 1);
});
