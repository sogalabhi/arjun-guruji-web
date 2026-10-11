/* eslint-env node */
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createPanchangEngine } from "../src/data/panchangCalculations.js";
import { calendarYears, durMuhurtas } from "../src/data/panchangConventions.js";
import { panchangTime, panchangDuration } from "../src/data/panchangFormatting.js";
import { translateName } from "../src/data/panchangKannada.js";
import { dateMillis, DAY_MS } from "../src/data/dates.js";

const require = createRequire(import.meta.url);
const api = {
  ...require("@ishubhamx/panchangam-js/dist/core/calculations.js"),
  ...require("@ishubhamx/panchangam-js/dist/ephemeris/ayanamsa.js"),
  ...require("@ishubhamx/panchangam-js/dist/core/constants.js"),
  ...require("astronomy-engine"),
};
const engine = createPanchangEngine(api);
const calculate = (date, city = "Mysore") => engine.getForDate(...date.split("-").map(Number), city, true);
const elapsed = (time) => time.split(":").map(Number).reduce((total, value) => total * 60 + value, 0) * 1000;

// Independent published Mysuru observations, October 1–10, 2026:
// https://www.mypanchang.com/phppanchang.php?cityname=Mysore-Karnataka-India&mn=09&monthtype=0&yr=2026
// Names are normalized to the engine's vocabulary. Location/sunrise conventions
// differ, so test geocentric transitions within 30 seconds, not rise/set equality.
const reference = [
  [1, "Panchami", "12:35:28", "Rohini", "28:26:55", "Siddhi", "21:17:42"],
  [2, "Shashthi", "10:15:27", "Mrigashira", "26:54:43", "Vyatipata", "18:17:01"],
  [3, "Saptami", "07:59:53", "Ardra", "25:29:24", "Variyana", "15:20:56"],
  [4, "Navami", "27:54:01", "Punarvasu", "24:13:33", "Parigha", "12:31:41"],
  [5, "Dashami", "26:07:46", "Pushya", "23:08:59", "Shiva", "09:50:54"],
  [6, "Ekadashi", "24:34:47", "Ashlesha", "22:17:16", "Siddha", "07:19:48"],
  [7, "Dwadashi", "23:16:49", "Magha", "21:40:09", "Shubha", "26:51:36"],
  [8, "Trayodashi", "22:16:14", "Purva Phalguni", "21:19:53", "Shukla", "24:57:44"],
  [9, "Chaturdashi", "21:36:02", "Uttara Phalguni", "21:19:27", "Brahma", "23:20:15"],
  [10, "Amavasya", "21:19:49", "Hasta", "21:42:22", "Indra", "22:01:44"],
];
for (const [day, tithi, tithiEnd, nakshatra, nakshatraEnd, yoga, yogaEnd] of reference) {
  test(`detailed Panchanga agrees with published Mysuru observations: October ${day}`, () => {
    const date = `2026-10-${String(day).padStart(2, "0")}`;
    const p = calculate(date);
    const d = p.details;
    assert.equal(p.tithiName, tithi);
    assert.equal(d.nakshatraName, nakshatra);
    assert.equal(d.yogaName, yoga);
    for (const [field, expected] of [["tithiEnd", tithiEnd], ["nakshatraEnd", nakshatraEnd], ["yogaEnd", yogaEnd]]) {
      assert.ok(Math.abs(d[field] - dateMillis(date) - elapsed(expected)) < 30000, `${field} differs by over 30 seconds`);
    }
    assert.equal(p.lunarMonth, "Bhadrapada");
    assert.equal(d.shaka, 1948);
    assert.equal(d.kali, 5127);
    assert.equal(d.samvatsara, "Parabhava");
    assert.equal(d.ritu, "Varsha");
    assert.equal(d.drikRitu, "Sharad");
    for (const values of [d.tithis, d.nakshatras, d.yogas, d.karanas]) {
      assert.equal(values[0].start, p.sunrise);
      assert.equal(values.at(-1).end, d.nextSunrise);
      for (let i = 0; i < values.length; i++) {
        assert.ok(values[i].end > values[i].start);
        if (i) assert.equal(values[i].start, values[i - 1].end);
      }
      assert.equal(values.at(-1).endsWithinDay, false);
    }
  });
}

test("new moon Karana wraps from Chatushpada through Naga to Kimstughna", () => {
  const p = calculate("2026-10-10");
  const d = p.details;
  assert.deepEqual(d.karanas.map((value) => value.name), ["Chatushpada", "Naga", "Kimstughna"]);
  assert.ok(Math.abs(d.karanas[1].end - d.tithiEnd) < 1000);
  assert.ok(Math.abs(d.karanas[0].end - dateMillis("2026-10-10") - elapsed("09:24:42")) < 10000);
  assert.equal(d.colour, "Blue");
  assert.equal(d.moonRashi, "Virgo");
  assert.equal(d.sunRashi, "Virgo");
});

test("moon events follow sunrise and distinguish missing civil-day rises", () => {
  const p = calculate("2026-10-10");
  assert.ok(p.details.civilMoonrise < p.sunrise);
  assert.ok(p.details.moonrise > dateMillis("2026-10-10") + DAY_MS);
  assert.match(panchangTime(p.details.moonrise, "2026-10-10", true, "en"), /^30:\d{2}:\d{2} \(next day\)$/);
  const noRise = calculate("2026-10-03");
  assert.equal(noRise.details.civilMoonrise, null);
  assert.ok(noRise.details.moonrise > dateMillis("2026-10-03") + DAY_MS);
});

test("day and night durations use the actual following sunrise", () => {
  const p = calculate("2026-06-21", "Mumbai");
  assert.equal(p.details.dayDuration, p.sunset - p.sunrise);
  assert.equal(p.details.nightDuration, p.details.nextSunrise - p.sunset);
  assert.equal(p.details.dayDuration + p.details.nightDuration, p.details.nextSunrise - p.sunrise);
  assert.notEqual(p.details.nextSunrise, p.sunrise + DAY_MS);
});

test("elapsed years follow the sunrise Amanta month across March and April", () => {
  for (const [date, shaka, samvatsara] of [
    ["2026-01-01", 1947, "Vishvavasu"], ["2026-03-18", 1947, "Vishvavasu"],
    ["2026-03-20", 1948, "Parabhava"], ["2027-04-06", 1948, "Parabhava"],
    ["2027-04-07", 1949, "Plavanga"],
  ]) {
    const d = calculate(date).details;
    assert.equal(d.shaka, shaka, date);
    assert.equal(d.kali, shaka + 3179);
    assert.equal(d.samvatsara, samvatsara);
  }
  assert.equal(calendarYears(1987, 4, 0, api.samvatsaraNames).samvatsara, "Prabhava");
  assert.equal(calendarYears(2047, 4, 0, api.samvatsaraNames).samvatsara, "Prabhava");
});

test("all weekday Dur Muhurtas include Tuesday night and Saturday morning", () => {
  const start = dateMillis("2026-10-11");
  const rise = start + 6 * 3600000;
  const set = start + 18 * 3600000;
  const next = rise + DAY_MS;
  const expected = [
    [["16:24:00", "17:12:00"]], [["12:24:00", "13:12:00"], ["14:48:00", "15:36:00"]],
    [["08:24:00", "09:12:00"], ["23:36:00", "24:24:00"]], [["11:36:00", "12:24:00"]],
    [["10:00:00", "10:48:00"], ["14:48:00", "15:36:00"]],
    [["08:24:00", "09:12:00"], ["12:24:00", "13:12:00"]],
    [["06:00:00", "06:48:00"], ["06:48:00", "07:36:00"]],
  ];
  expected.forEach((windows, weekday) => {
    const actual = durMuhurtas(rise, set, next, weekday);
    assert.deepEqual(actual.map(({ start: from, end }) => [from - start, end - start]), windows.map(([from, to]) => [elapsed(from), elapsed(to)]));
  });
  assert.equal(calculate("2026-10-07").details.abhijit, null);
  assert.ok(calculate("2026-10-10").details.abhijit);
});

test("Kannada vocabulary covers all engine names without month/nakshatra collisions", () => {
  for (const [kind, names] of [["tithi", api.tithiNames], ["nakshatra", api.nakshatraNames], ["yoga", api.yogaNames], ["karana", api.karanaNames], ["masa", api.masaNames], ["rashi", api.rashiNames], ["ritu", api.rituNames], ["ayana", api.ayanaNames], ["samvatsara", api.samvatsaraNames]]) {
    for (const name of names) {
      const translated = translateName(name, "kn", kind);
      assert.match(translated, /[\u0C80-\u0CFF]/, `${kind}: ${name}`);
      assert.equal(translateName(name, "en", kind), name);
    }
  }
  assert.equal(translateName("Magha", "kn", "nakshatra"), "ಮಘಾ");
  assert.equal(translateName("Magha", "kn", "masa"), "ಮಾಘ");
});

test("traditional and clock formats retain day offsets, seconds and missing values", () => {
  const start = dateMillis("2026-10-10");
  const nextRise = start + elapsed("30:29:03");
  assert.equal(panchangTime(nextRise, "2026-10-10", true, "en"), "30:29:03 (next day)");
  assert.equal(panchangTime(nextRise, "2026-10-10", false, "en"), "06:29:03 (next day)");
  assert.equal(panchangTime(start - 1000, "2026-10-10", true, "en"), "23:59:59 (previous day)");
  assert.equal(panchangTime(start + 2 * DAY_MS, "2026-10-10", true, "en"), "48:00:00 (+2 days)");
  assert.equal(panchangTime(start, "garbage"), "—");
  assert.equal(panchangTime(null, "2026-10-10"), "—");
  assert.equal(panchangDuration(elapsed("11:55:03"), "en"), "11 h 55 m 3 s");
  assert.equal(panchangDuration(-1), "—");
});

test("summary results stay compact and the supported date endpoints have details", () => {
  assert.equal(engine.getForDate(2026, 10, 10, "Mysore").details, undefined);
  for (const date of ["1900-01-01", "2100-12-31"]) {
    const p = calculate(date);
    assert.ok(Number.isFinite(p.details.nextSunrise));
    assert.ok(p.details.karanas.length >= 2);
  }
});

test("Home summary almanac fields match the detail page", () => {
  for (const date of ["2026-01-14", "2026-03-19", "2026-04-15", "2026-07-17", "2026-10-11"]) {
    const p = engine.getForDate(...date.split("-").map(Number), "Mysore", true);
    for (const key of ["samvatsara", "ayana", "ritu", "isAdhika", "weekday", "tithiEnd"]) assert.equal(p[key], p.details[key], `${date} ${key}`);
    assert.ok(p.tithiEnd > p.sunrise, `${date} tithi ends after sunrise`);
  }
});
