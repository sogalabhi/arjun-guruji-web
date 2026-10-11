// Time text for the seek bar. Pure, so it can be unit tested.

const whole = (seconds) => (Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0);

// m:ss, or h:mm:ss for an hour or more.
export function formatTime(seconds) {
  const total = whole(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

// "1 minute 20 seconds", for aria-valuetext.
export function spokenTime(seconds) {
  const total = whole(seconds);
  const parts = [];
  const unit = (n, name) => `${n} ${name}${n === 1 ? "" : "s"}`;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) parts.push(unit(h, "hour"));
  if (m) parts.push(unit(m, "minute"));
  if (s || parts.length === 0) parts.push(unit(s, "second"));
  return parts.join(" ");
}
