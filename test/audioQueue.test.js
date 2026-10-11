import assert from "node:assert/strict";
import test from "node:test";
import { clampSeek, endedAction, nextIndex, nextRepeat, previousAction, randomOther, REPEAT } from "../src/audio/queue.js";
import { formatTime, spokenTime } from "../src/audio/time.js";

const RANDOMS = [0, 0.1, 0.34, 0.5, 0.67, 0.9, 0.999999, 1];

test("repeat cycles Off, All, One and back", () => {
  assert.deepEqual(REPEAT, ["off", "all", "one"]);
  assert.equal(nextRepeat("off"), "all");
  assert.equal(nextRepeat("all"), "one");
  assert.equal(nextRepeat("one"), "off");
  assert.equal(nextRepeat("unknown"), "off");
});

test("random other track never equals the current one and stays in range", () => {
  for (const length of [2, 3, 7]) {
    for (let current = 0; current < length; current++) {
      for (const r of RANDOMS) {
        const n = randomOther(length, current, r);
        assert.notEqual(n, current);
        assert.ok(n >= 0 && n < length);
      }
    }
  }
  assert.equal(randomOther(1, 0, 0.7), 0);
  assert.equal(randomOther(0, 0, 0.7), 0);
});

test("next moves forward, wraps with repeat, and stops at the end with repeat off", () => {
  const q = { length: 3, shuffle: false, random: 0.5 };
  assert.equal(nextIndex({ ...q, index: 0, repeat: "off" }), 1);
  assert.equal(nextIndex({ ...q, index: 1, repeat: "off" }), 2);
  assert.equal(nextIndex({ ...q, index: 2, repeat: "off" }), null);
  assert.equal(nextIndex({ ...q, index: 2, repeat: "all" }), 0);
  assert.equal(nextIndex({ ...q, index: 2, repeat: "one" }), 0);
});

test("next with shuffle picks another track, even with repeat off", () => {
  for (const r of RANDOMS) {
    const n = nextIndex({ index: 1, length: 4, shuffle: true, repeat: "off", random: r });
    assert.notEqual(n, 1);
    assert.ok(n >= 0 && n < 4);
  }
});

test("single-track and empty lists", () => {
  assert.equal(nextIndex({ index: 0, length: 1, shuffle: false, repeat: "off", random: 0.5 }), null);
  assert.equal(nextIndex({ index: 0, length: 1, shuffle: false, repeat: "all", random: 0.5 }), 0);
  assert.equal(nextIndex({ index: 0, length: 1, shuffle: true, repeat: "off", random: 0.5 }), 0);
  assert.equal(nextIndex({ index: 0, length: 0, shuffle: false, repeat: "all", random: 0.5 }), null);
  assert.deepEqual(previousAction({ position: 0, index: 0, length: 1, shuffle: false, random: 0.5 }), { index: 0 });
  assert.deepEqual(previousAction({ position: 0, index: 0, length: 0, shuffle: false, random: 0.5 }), { restart: true });
});

test("previous restarts after 3 seconds, otherwise goes back and wraps to the last track", () => {
  const q = { length: 4, shuffle: false, random: 0.5 };
  assert.deepEqual(previousAction({ ...q, index: 2, position: 3.5 }), { restart: true });
  assert.deepEqual(previousAction({ ...q, index: 0, position: 120 }), { restart: true });
  assert.deepEqual(previousAction({ ...q, index: 2, position: 3 }), { index: 1 });
  assert.deepEqual(previousAction({ ...q, index: 2, position: 0 }), { index: 1 });
  assert.deepEqual(previousAction({ ...q, index: 0, position: 1 }), { index: 3 });
});

test("previous with shuffle goes to a random other track", () => {
  for (const r of RANDOMS) {
    const action = previousAction({ index: 2, length: 5, shuffle: true, position: 0, random: r });
    assert.notEqual(action.index, 2);
    assert.ok(action.index >= 0 && action.index < 5);
  }
  assert.deepEqual(previousAction({ index: 2, length: 5, shuffle: true, position: 9, random: 0.5 }), { restart: true });
});

test("when a track ends: One replays, All advances and wraps, Off advances then stops at the end", () => {
  const q = { index: 1, length: 3, shuffle: false, random: 0.5 };
  assert.equal(endedAction({ ...q, repeat: "one" }), "replay");
  assert.deepEqual(endedAction({ ...q, repeat: "all" }), { index: 2 });
  assert.deepEqual(endedAction({ ...q, repeat: "off" }), { index: 2 });
  assert.equal(endedAction({ ...q, repeat: "off", index: 2 }), "stop");
  assert.notEqual(endedAction({ ...q, repeat: "off", shuffle: true }).index, 1);
  assert.deepEqual(endedAction({ ...q, repeat: "all", index: 2 }), { index: 0 });
  assert.equal(endedAction({ ...q, repeat: "one", index: 2 }), "replay");
  assert.deepEqual(endedAction({ index: 0, length: 1, shuffle: false, repeat: "all", random: 0.5 }), { index: 0 });
  assert.equal(endedAction({ index: 0, length: 0, shuffle: false, repeat: "all", random: 0.5 }), "stop");
});

test("when a track ends with All and shuffle, another track plays", () => {
  for (const r of RANDOMS) {
    const action = endedAction({ index: 0, length: 3, shuffle: true, repeat: "all", random: r });
    assert.notEqual(action.index, 0);
  }
});

test("seeking is clamped to the track", () => {
  assert.equal(clampSeek(-10, 200), 0);
  assert.equal(clampSeek(50, 200), 50);
  assert.equal(clampSeek(215, 200), 200);
  assert.equal(clampSeek(215, 0), 215);
  assert.equal(clampSeek(-5, NaN), 0);
  assert.equal(clampSeek(NaN, 100), 0);
  assert.equal(clampSeek(30, Infinity), 30);
});

test("time is shown as m:ss or h:mm:ss", () => {
  assert.equal(formatTime(0), "0:00");
  assert.equal(formatTime(5.9), "0:05");
  assert.equal(formatTime(80), "1:20");
  assert.equal(formatTime(600), "10:00");
  assert.equal(formatTime(3600), "1:00:00");
  assert.equal(formatTime(3725), "1:02:05");
  assert.equal(formatTime(NaN), "0:00");
  assert.equal(formatTime(-4), "0:00");
});

test("spoken time reads naturally", () => {
  assert.equal(spokenTime(80), "1 minute 20 seconds");
  assert.equal(spokenTime(300), "5 minutes");
  assert.equal(spokenTime(1), "1 second");
  assert.equal(spokenTime(0), "0 seconds");
  assert.equal(spokenTime(3720), "1 hour 2 minutes");
  assert.equal(spokenTime(Infinity), "0 seconds");
});
