import assert from "node:assert/strict";
import test from "node:test";
import { mapEvent, nextProgramme } from "../src/data/eventSchedule.js";

const now = Date.parse("2026-10-11T10:00:00+05:30");
const event = (id, overrides = {}) => mapEvent(id, {
  title: id, eventType: "Simple",
  startDate: "2026-10-12T09:00:00+05:30", endDate: "2026-10-12T11:00:00+05:30",
  ...overrides,
});

test("expired events marked Upcoming do not appear; active weekly programmes use their next day", () => {
  const expired = event("expired", { status: "Upcoming", startDate: "2025-04-10", endDate: "2025-04-10" });
  const weekly = event("Thursday bhajan", { eventType: "Recurring", frequency: "weekly", day: "Thursday", startDate: "2025-04-12T00:00:00+05:30", endDate: "2030-12-31T00:00:00+05:30" });
  const next = nextProgramme([expired, weekly], now);
  assert.equal(next.id, weekly.id);
  assert.equal(next.occurrence, Date.parse("2026-10-15T00:00:00+05:30"));
  assert.equal(next.today, false);
});

test("weekly programmes appear on the current IST day, even for browsers in other time zones", () => {
  const weekly = event("Thursday", { eventType: "Recurring", frequency: "weekly", day: "Thursday", startDate: "2025-04-12T00:00:00+05:30", endDate: "2030-12-31T00:00:00+05:30" });
  const next = nextProgramme([weekly], Date.parse("2026-10-14T20:00:00Z"));
  assert.equal(next.today, true);
  assert.equal(next.occurrence, Date.parse("2026-10-15T00:00:00+05:30"));
});

test("recurrences cannot extend past their end date or precede their start date", () => {
  const ended = event("ended", { eventType: "Recurring", frequency: "weekly", day: "Thursday", startDate: "2025-04-12", endDate: "2026-10-12" });
  assert.equal(nextProgramme([ended], now), null);
  const future = event("future", { eventType: "Recurring", frequency: "weekly", day: "Thursday", startDate: "2026-10-20T00:00:00+05:30", endDate: "2030-12-31" });
  assert.equal(nextProgramme([future], now).occurrence, Date.parse("2026-10-22T00:00:00+05:30"));
});

test("ongoing multi-day programmes take precedence over future events", () => {
  const ongoing = event("ongoing", { startDate: "2026-10-09T09:00:00+05:30", endDate: "2026-10-13T18:00:00+05:30" });
  assert.equal(nextProgramme([event("future"), ongoing], now).id, "ongoing");
});

test("cancelled and completed programmes, and earlier timed events today, are excluded", () => {
  const pastToday = event("finished", { startDate: "2026-10-11T07:00:00+05:30", endDate: "2026-10-11T09:00:00+05:30" });
  assert.equal(nextProgramme([event("cancelled", { status: "Cancelled" }), event("completed", { status: "Completed" }), pastToday], now), null);
});

test("date-only events remain visible throughout their final IST day, including fractional timestamps", () => {
  const allDay = event("all day", { startDate: "2026-10-11T00:00:00.829+05:30", endDate: "2026-10-11T00:00:00.829+05:30" });
  assert.equal(nextProgramme([allDay], now).today, true);
  assert.equal(nextProgramme([allDay], now).dateOnly, true);
  assert.equal(nextProgramme([allDay], Date.parse("2026-10-12T00:00:00+05:30")), null);
});

test("malformed records are ignored while legitimate titles matching Kannada IDs are preserved", () => {
  assert.equal(mapEvent("bad", { title: "bad", startDate: "invalid" }), null);
  assert.equal(mapEvent("empty", { startDate: "2026-10-12" }), null);
  assert.equal(event("4K9TzN0hmNPOJB2WGrK4"), null);
  assert.equal(event("ಗುರು ಪೂರ್ಣಿಮೆ").title, "ಗುರು ಪೂರ್ಣಿಮೆ");
  const timestamp = { toMillis: () => now };
  assert.equal(event("timestamp", { startDate: timestamp, endDate: timestamp }).start, now);
});
