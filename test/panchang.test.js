/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { createPanchangEngine } from "../src/data/panchangCalculations.js";
import { dateMillis, DAY_MS, formatTime } from "../src/data/dates.js";

const require = createRequire(import.meta.url);
const api = {
  ...require("@ishubhamx/panchangam-js/dist/core/calculations.js"),
  ...require("@ishubhamx/panchangam-js/dist/ephemeris/ayanamsa.js"),
  ...require("@ishubhamx/panchangam-js/dist/core/constants.js"),
  ...require("astronomy-engine"),
};
const engine = createPanchangEngine(api);
// Reference data captured from the existing app before changing web engines.
const fixtures = JSON.parse(readFileSync(new URL("./fixtures/panchang.json", import.meta.url), "utf8"));
const normalized = (name) => name.replace("Prathama", "Pratipada").replace("Ashwina", "Ashvina");
for (const { date, city, info } of fixtures) {
  test(`JavaScript Panchang reference comparison: ${date}, ${city}`, () => {
    const actual = engine.getForDate(...date.split("-").map(Number), city);
    assert.equal(normalized(actual.tithiName), info.tithiName);
    assert.equal(actual.paksha, info.paksha);
    assert.equal(normalized(actual.lunarMonth), info.lunarMonth);
    for (const key of ["sunrise", "sunset", "rahuStart", "rahuEnd"]) {
      assert.ok(Math.abs(actual[key] - info[key]) <= 5000, `${key}: ${actual[key]} versus ${info[key]}`);
      assert.equal(formatTime(actual[key]), formatTime(info[key]));
    }
    assert.equal(actual.segments.length, info.segments.length);
    assert.equal(actual.segments[0].start, dateMillis(date));
    assert.equal(actual.segments.at(-1).end, dateMillis(date) + DAY_MS);
    actual.segments.forEach((segment, index) => {
      assert.equal(normalized(segment.tithiName), info.segments[index].tithiName);
      assert.equal(segment.paksha, info.segments[index].paksha);
      assert.ok(Math.abs(segment.end - info.segments[index].end) <= 5000);
      if (index) assert.equal(segment.start, actual.segments[index - 1].end);
    });
  });
}
test("engine validates inputs and supports Indian cities and aliases", () => {
  assert.equal(engine.version, "3.0.0");
  assert.equal(engine.cities().length, 69);
  assert.equal(engine.getForDate(2026, 2, 30, "Mysore"), null);
  assert.equal(engine.getForDate(1800, 1, 1, "Mysore"), null);
  assert.equal(engine.getForDate(2026, 1, 1, "No such city"), null);
  assert.deepEqual(engine.getForDate(2026, 10, 11, "Mysuru"), engine.getForDate(2026, 10, 11, "Mysore"));
  assert.deepEqual(engine.getForDate(2026, 10, 11, "Bengaluru"), engine.getForDate(2026, 10, 11, "Bangalore"));
});
test("Yamaganda and Gulika follow the package's weekday conventions", () => {
  // A 6 AM–6 PM daylight window makes the traditional periods explicit.
  // The old reference app used different assignments for these two fields.
  const sunrise = new Date("2026-10-11T00:30:00Z");
  const sunset = new Date("2026-10-11T12:30:00Z");
  const yama = ["12:00 PM", "10:30 AM", "9:00 AM", "7:30 AM", "6:00 AM", "3:00 PM", "1:30 PM"];
  const gulika = ["3:00 PM", "1:30 PM", "12:00 PM", "10:30 AM", "9:00 AM", "7:30 AM", "6:00 AM"];
  for (let weekday = 0; weekday < 7; weekday++) {
    assert.equal(formatTime(api.calculateYamagandaKalam(sunrise, sunset, weekday).start.getTime()), yama[weekday]);
    assert.equal(formatTime(api.calculateGulikaKalam(sunrise, sunset, weekday).start.getTime()), gulika[weekday]);
  }
});
test("IST calculations are identical across UTC, IST and DST host timezones", () => {
  const script = `
    import {createRequire} from 'node:module';
    import {createPanchangEngine} from './src/data/panchangCalculations.js';
    const require = createRequire(import.meta.url);
    const engine = createPanchangEngine({
      ...require('@ishubhamx/panchangam-js/dist/core/calculations.js'),
      ...require('@ishubhamx/panchangam-js/dist/ephemeris/ayanamsa.js'),
      ...require('@ishubhamx/panchangam-js/dist/core/constants.js'),
      ...require('astronomy-engine'),
    });
    console.log(JSON.stringify([engine.getForDate(2026,3,8,'Mysore'),engine.getForDate(2026,11,1,'Bangalore')]));
  `;
  const run = (TZ) => execFileSync(process.execPath, ["--input-type=module", "-e", script], { cwd: new URL("../", import.meta.url), env: { ...process.env, TZ }, encoding: "utf8" });
  const reference = run("UTC");
  for (const timezone of ["Asia/Kolkata", "America/New_York", "America/Los_Angeles"]) assert.equal(run(timezone), reference);
});
