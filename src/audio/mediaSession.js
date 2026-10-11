// Lock-screen / notification controls through the Media Session API.
// Every call is guarded, so browsers without support simply do nothing.

const supported = () => typeof navigator !== "undefined" && "mediaSession" in navigator;

export const SKIP_SECONDS = 10;

export function setMetadata(track) {
  if (!supported() || typeof window.MediaMetadata === "undefined") return;
  try {
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: track.title,
      artist: track.category,
      album: track.category,
      artwork: track.imageUrl ? [{ src: track.imageUrl, sizes: "512x512" }] : [],
    });
  } catch {
    // Unsupported artwork or metadata: playback is unaffected.
  }
}

// status: "idle" | "loading" | "playing" | "paused" | "error"
export function setPlaybackState(status) {
  if (!supported()) return;
  try {
    navigator.mediaSession.playbackState = status === "playing" ? "playing" : status === "idle" ? "none" : "paused";
  } catch {
    // ignore
  }
}

export function setPositionState(duration, position, rate = 1) {
  if (!supported() || !navigator.mediaSession.setPositionState) return;
  try {
    if (Number.isFinite(duration) && duration > 0) {
      navigator.mediaSession.setPositionState({ duration, position: Math.min(Math.max(position, 0), duration), playbackRate: rate || 1 });
    } else {
      navigator.mediaSession.setPositionState();
    }
  } catch {
    // Some browsers reject unusual values: the position is only cosmetic.
  }
}

const ACTIONS = ["play", "pause", "previoustrack", "nexttrack", "seekto", "seekbackward", "seekforward"];

// handlers: { play, pause, previoustrack, nexttrack, seekto(details), seekbackward(details), seekforward(details) }
// Returns a function that removes them.
export function setHandlers(handlers) {
  if (!supported()) return () => {};
  for (const action of ACTIONS) {
    try {
      navigator.mediaSession.setActionHandler(action, handlers[action] ?? null);
    } catch {
      // This browser does not support that action.
    }
  }
  return () => {
    for (const action of ACTIONS) {
      try {
        navigator.mediaSession.setActionHandler(action, null);
      } catch {
        // ignore
      }
    }
  };
}

export function clearSession() {
  if (!supported()) return;
  try {
    navigator.mediaSession.metadata = null;
    navigator.mediaSession.playbackState = "none";
  } catch {
    // ignore
  }
}

// Short buzz on Android; does nothing on iPhone and desktop.
export function haptic() {
  try {
    navigator.vibrate?.(8);
  } catch {
    // ignore
  }
}
