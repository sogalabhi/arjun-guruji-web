// Pure queue rules for the audio player, matching the app's GlobalAudioPlayerBloc.
// No browser, React or Firebase imports, so node --test can load this file.
// `random` arguments are numbers in [0, 1), e.g. Math.random().

export const REPEAT = ["off", "all", "one"];

// Repeat cycles Off -> All -> One -> Off.
export function nextRepeat(mode) {
  return REPEAT[(REPEAT.indexOf(mode) + 1) % REPEAT.length];
}

// A random index that is never `current`. A single-track list returns 0.
export function randomOther(length, current, random) {
  if (length <= 1) return 0;
  const r = Math.min(Math.max(random, 0), 0.999999);
  const n = Math.floor(r * (length - 1));
  return n >= current ? n + 1 : n;
}

// Index to play after the current one, or null to stop (end of list, repeat off).
export function nextIndex({ index, length, shuffle, repeat, random }) {
  if (length <= 0) return null;
  if (shuffle) return randomOther(length, index, random);
  const next = index + 1;
  if (next < length) return next;
  return repeat === "off" ? null : 0;
}

// Previous restarts the track after 3 seconds; otherwise it goes back one track
// (wrapping to the last), or to a random other track with shuffle on.
export function previousAction({ position, index, length, shuffle, random }) {
  if (length <= 0 || position > 3) return { restart: true };
  if (shuffle) return { index: randomOther(length, index, random) };
  return { index: index <= 0 ? length - 1 : index - 1 };
}

// What to do when a track finishes: "replay", { index } or "stop".
// Repeat Off stops even with shuffle on, as in the app.
export function endedAction({ repeat, index, length, shuffle, random }) {
  if (repeat === "one") return "replay";
  if (repeat === "off") return "stop";
  const target = nextIndex({ index, length, shuffle, repeat: "all", random });
  return target === null ? "stop" : { index: target };
}

// Keeps a seek inside the track. Unknown duration only clamps the lower end.
export function clampSeek(position, duration) {
  const p = Number.isFinite(position) ? Math.max(0, position) : 0;
  return Number.isFinite(duration) && duration > 0 ? Math.min(p, duration) : p;
}
