import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerContext, TimeContext } from "./context";
import { clampSeek, endedAction, nextIndex, nextRepeat, previousAction, REPEAT } from "./queue";
import { clearSession, setHandlers, setMetadata, setPositionState, SKIP_SECONDS, setPlaybackState } from "./mediaSession";

// One HTMLAudioElement for the whole site, owned here so playback survives route
// changes. Behaviour follows the app's GlobalAudioPlayerBloc (see docs/web_rebuild_plan.md).

const KEY = "audio-settings";
const DEFAULT_PREFS = { shuffle: false, repeat: "off" };
const EMPTY_QUEUE = { categoryId: null, tracks: [] };
const EMPTY_TIME = { position: 0, duration: 0, buffered: 0 };

function loadPrefs() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (v && REPEAT.includes(v.repeat)) return { shuffle: v.shuffle === true, repeat: v.repeat };
  } catch {
    // ignore
  }
  return DEFAULT_PREFS;
}

export default function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [queue, setQueue] = useState(EMPTY_QUEUE);
  const [index, setIndex] = useState(-1);
  const [status, setStatusState] = useState("idle"); // idle | loading | playing | paused | error
  const [direction, setDirection] = useState(1); // 1 = moved forward, -1 = moved back (for slide animations)
  const [prefs, setPrefs] = useState(loadPrefs);
  const [time, setTime] = useState(EMPTY_TIME);

  // Latest values for event handlers and actions, which must not read stale state.
  const live = useRef(null);
  if (live.current === null) {
    live.current = { queue: EMPTY_QUEUE, index: -1, status: "idle", prefs, lastPosition: 0, resumeAt: null };
  }

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "metadata";
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const setStatus = useCallback((next) => {
    if (live.current.status === next) return;
    live.current.status = next;
    setStatusState(next);
  }, []);

  const publishTime = useCallback(() => {
    const audio = getAudio();
    const position = audio.currentTime || 0;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    let buffered = 0;
    const ranges = audio.buffered;
    for (let i = 0; i < ranges.length; i++) {
      if (ranges.start(i) <= position + 0.25 && ranges.end(i) >= position) buffered = Math.max(buffered, ranges.end(i));
    }
    setTime((prev) =>
      prev.position === position && prev.duration === duration && prev.buffered === buffered ? prev : { position, duration, buffered },
    );
  }, [getAudio]);

  const syncPosition = useCallback(() => {
    const audio = getAudio();
    setPositionState(audio.duration, audio.currentTime, audio.playbackRate);
  }, [getAudio]);

  // play() must run synchronously inside the user's tap for iPhone Safari, so
  // callers invoke these directly from their handlers.
  const requestPlay = useCallback(
    (audio) => {
      const result = audio.play();
      if (result && typeof result.catch === "function") {
        result.catch((err) => {
          if (err?.name === "AbortError") return; // replaced by a newer load or a pause
          if (err?.name === "NotAllowedError") {
            setStatus("paused"); // the browser wants a tap
            return;
          }
          live.current.resumeAt ??= live.current.lastPosition;
          setStatus("error");
        });
      }
    },
    [setStatus],
  );

  const commitQueue = useCallback((tracks, categoryId) => {
    const L = live.current;
    if (L.queue.tracks === tracks && L.queue.categoryId === categoryId) return;
    L.queue = { categoryId, tracks };
    setQueue(L.queue);
  }, []);

  const startTrack = useCallback(
    (i, { autoplay, dir = 1, resumeAt = null }) => {
      const L = live.current;
      const track = L.queue.tracks[i];
      if (!track) return;
      const audio = getAudio();
      L.index = i;
      L.lastPosition = resumeAt ?? 0;
      L.resumeAt = resumeAt;
      setIndex(i);
      setDirection(dir);
      setTime(EMPTY_TIME);
      setStatus(autoplay ? "loading" : "paused");
      audio.src = track.audioUrl;
      setMetadata(track);
      if (autoplay) requestPlay(audio);
    },
    [getAudio, requestPlay, setStatus],
  );

  // End of the list with Repeat off: stay on the last track, paused at 0:00, so it can be replayed.
  const stopAtEnd = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    audio.currentTime = 0;
    live.current.lastPosition = 0;
    setTime((prev) => ({ ...prev, position: 0 }));
    setStatus("paused");
    syncPosition();
  }, [getAudio, setStatus, syncPosition]);

  const retry = useCallback(() => {
    const L = live.current;
    const track = L.queue.tracks[L.index];
    if (!track) return;
    const audio = getAudio();
    L.resumeAt ??= L.lastPosition;
    setStatus("loading");
    audio.src = track.audioUrl;
    requestPlay(audio);
  }, [getAudio, requestPlay, setStatus]);

  const play = useCallback(
    (tracks, i, { fresh = false } = {}) => {
      const track = tracks[i];
      if (!track) return;
      const L = live.current;
      const current = L.queue.tracks[L.index];
      const same = Boolean(current) && current.id === track.id && current.categoryId === track.categoryId;
      commitQueue(tracks, track.categoryId);
      if (same && !fresh) {
        // Already loaded: just resume.
        L.index = i;
        setIndex(i);
        const audio = getAudio();
        if (L.status === "error") retry();
        else if (audio.paused) requestPlay(audio);
        return;
      }
      startTrack(i, { autoplay: true, dir: 1 });
    },
    [commitQueue, getAudio, requestPlay, retry, startTrack],
  );

  // Loads a track without playing it (a shared player link).
  const load = useCallback(
    (tracks, i) => {
      const track = tracks[i];
      if (!track) return;
      commitQueue(tracks, track.categoryId);
      startTrack(i, { autoplay: false });
    },
    [commitQueue, startTrack],
  );

  const toggle = useCallback(() => {
    const L = live.current;
    if (L.index < 0) return;
    if (L.status === "error") {
      retry();
      return;
    }
    const audio = getAudio();
    if (audio.paused) requestPlay(audio);
    else audio.pause();
  }, [getAudio, requestPlay, retry]);

  const next = useCallback(() => {
    const L = live.current;
    if (L.index < 0) return;
    const target = nextIndex({
      index: L.index,
      length: L.queue.tracks.length,
      shuffle: L.prefs.shuffle,
      repeat: L.prefs.repeat,
      random: Math.random(),
    });
    if (target === null) stopAtEnd();
    else startTrack(target, { autoplay: true, dir: 1 });
  }, [startTrack, stopAtEnd]);

  const seek = useCallback(
    (seconds) => {
      const L = live.current;
      if (L.index < 0) return;
      const audio = getAudio();
      audio.currentTime = clampSeek(seconds, audio.duration);
      L.lastPosition = audio.currentTime;
      if (L.status === "error") L.resumeAt = L.lastPosition;
      publishTime();
      syncPosition();
    },
    [getAudio, publishTime, syncPosition],
  );

  const previous = useCallback(() => {
    const L = live.current;
    if (L.index < 0) return;
    const audio = getAudio();
    const action = previousAction({
      position: audio.currentTime,
      index: L.index,
      length: L.queue.tracks.length,
      shuffle: L.prefs.shuffle,
      random: Math.random(),
    });
    if (action.restart) seek(0);
    else startTrack(action.index, { autoplay: true, dir: -1 });
  }, [getAudio, seek, startTrack]);

  const skip = useCallback(
    (seconds) => {
      const L = live.current;
      if (L.index < 0) return;
      const base = L.status === "error" ? L.lastPosition : getAudio().currentTime;
      seek(base + seconds);
    },
    [getAudio, seek],
  );

  const updatePrefs = useCallback((patch) => {
    const merged = { ...live.current.prefs, ...patch };
    live.current.prefs = merged;
    setPrefs(merged);
  }, []);
  const toggleShuffle = useCallback(() => updatePrefs({ shuffle: !live.current.prefs.shuffle }), [updatePrefs]);
  const setShuffle = useCallback((on) => updatePrefs({ shuffle: Boolean(on) }), [updatePrefs]);
  const cycleRepeat = useCallback(() => updatePrefs({ repeat: nextRepeat(live.current.prefs.repeat) }), [updatePrefs]);

  // Pause, reset and clear the queue; the mini player slides away.
  const stop = useCallback(() => {
    const L = live.current;
    const audio = getAudio();
    L.queue = EMPTY_QUEUE;
    L.index = -1;
    L.lastPosition = 0;
    L.resumeAt = null;
    L.status = "idle";
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setQueue(EMPTY_QUEUE);
    setIndex(-1);
    setStatusState("idle");
    setTime(EMPTY_TIME);
    clearSession();
  }, [getAudio]);

  const current = useCallback(() => {
    const L = live.current;
    return { track: L.queue.tracks[L.index] ?? null, index: L.index, queue: L.queue };
  }, []);

  // Element events -> state, plus lock-screen controls and reconnect.
  useEffect(() => {
    const audio = getAudio();
    const L = live.current;
    const active = () => L.index >= 0;

    const events = {
      loadstart: () => {
        if (active() && !audio.paused) setStatus("loading");
      },
      waiting: () => {
        if (active() && !audio.paused) setStatus("loading");
      },
      play: () => {
        if (active() && audio.readyState < 3) setStatus("loading");
      },
      playing: () => {
        if (!active()) return;
        setStatus("playing");
        syncPosition();
      },
      pause: () => {
        // A track that has just ended fires pause then ended; ended decides what happens next.
        if (!active() || audio.ended || L.status === "error") return;
        setStatus("paused");
        syncPosition();
      },
      ended: () => {
        if (!active()) return;
        const action = endedAction({
          repeat: L.prefs.repeat,
          index: L.index,
          length: L.queue.tracks.length,
          shuffle: L.prefs.shuffle,
          random: Math.random(),
        });
        if (action === "replay") {
          audio.currentTime = 0;
          requestPlay(audio);
        } else if (action === "stop") {
          stopAtEnd();
        } else {
          startTrack(action.index, { autoplay: true, dir: 1 });
        }
      },
      error: () => {
        // Clearing the source (stop) also raises an error event: ignore it.
        if (!active() || !audio.getAttribute("src")) return;
        L.resumeAt ??= L.lastPosition;
        setStatus("error");
      },
      loadedmetadata: () => {
        if (!active()) return;
        if (L.resumeAt != null && L.resumeAt > 0) {
          audio.currentTime = clampSeek(L.resumeAt, audio.duration);
        }
        L.resumeAt = null;
        publishTime();
        syncPosition();
      },
      timeupdate: () => {
        if (L.status !== "error") L.lastPosition = audio.currentTime;
        publishTime();
      },
      durationchange: () => {
        publishTime();
        syncPosition();
      },
      progress: () => publishTime(),
      seeked: () => {
        publishTime();
        syncPosition();
      },
    };
    for (const [name, handler] of Object.entries(events)) audio.addEventListener(name, handler);

    const onOnline = () => {
      if (L.status === "error") retry();
    };
    window.addEventListener("online", onOnline);

    const removeHandlers = setHandlers({
      play: () => {
        if (!active()) return;
        if (L.status === "error") retry();
        else if (audio.paused) requestPlay(audio);
      },
      pause: () => audio.pause(),
      previoustrack: previous,
      nexttrack: next,
      seekto: (details) => {
        if (typeof details?.seekTime === "number") seek(details.seekTime);
      },
      seekbackward: (details) => skip(-(details?.seekOffset || SKIP_SECONDS)),
      seekforward: (details) => skip(details?.seekOffset || SKIP_SECONDS),
    });

    return () => {
      for (const [name, handler] of Object.entries(events)) audio.removeEventListener(name, handler);
      window.removeEventListener("online", onOnline);
      removeHandlers();
      audio.pause();
    };
  }, [getAudio, next, previous, publishTime, requestPlay, retry, seek, setStatus, skip, startTrack, stopAtEnd, syncPosition]);

  // Repeat One loops natively, which also keeps going with the screen locked.
  useEffect(() => {
    getAudio().loop = prefs.repeat === "one";
  }, [getAudio, prefs.repeat]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }, [prefs]);

  useEffect(() => {
    setPlaybackState(status);
  }, [status]);

  const actions = useMemo(
    () => ({ play, load, toggle, next, previous, seek, skip, toggleShuffle, setShuffle, cycleRepeat, stop, retry, current }),
    [play, load, toggle, next, previous, seek, skip, toggleShuffle, setShuffle, cycleRepeat, stop, retry, current],
  );

  const track = index >= 0 ? (queue.tracks[index] ?? null) : null;
  const player = useMemo(
    () => ({ queue, index, track, status, direction, shuffle: prefs.shuffle, repeat: prefs.repeat, actions }),
    [queue, index, track, status, direction, prefs, actions],
  );

  return (
    <PlayerContext.Provider value={player}>
      <TimeContext.Provider value={time}>{children}</TimeContext.Provider>
    </PlayerContext.Provider>
  );
}
