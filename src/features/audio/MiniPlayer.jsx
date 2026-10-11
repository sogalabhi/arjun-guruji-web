import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useMatch } from "react-router-dom";
import Icon from "../../components/ui/Icon";
import { usePlayer, usePlayerTime } from "../../audio/context";
import { haptic } from "../../audio/mediaSession";
import Equalizer from "./Equalizer";
import { audioTrackPath } from "./paths";
import "./audio.css";

// Thin yellow line along the top edge showing how far the track has played.
function MiniProgress() {
  const { position, duration } = usePlayerTime();
  const fraction = duration > 0 ? Math.min(Math.max(position / duration, 0), 1) : 0;
  return (
    <div className="absolute inset-x-0 top-0 h-[3px] bg-white/20" aria-hidden="true">
      <div className="audio-mini-progress h-full bg-tile" style={{ transform: `scaleX(${fraction})` }} />
    </div>
  );
}

// Now-playing bar fixed to the bottom of every page except the player itself.
// Slides up when audio starts and down when closed. Its height (with the home-indicator
// inset) is published as --mini-player-h so pages can keep their content clear of it.
export default function MiniPlayer() {
  const { track, status, actions } = usePlayer();
  const onPlayer = useMatch("/audio/:categoryId/:trackId") !== null;
  const hasTrack = track !== null;
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const last = useRef(null);
  const wrap = useRef(null);
  if (track) last.current = track;

  useEffect(() => {
    if (onPlayer) {
      setMounted(false);
      setShown(false);
      return undefined;
    }
    if (hasTrack) {
      setMounted(true);
      let inner = 0;
      // Two frames: paint it below the screen first, then let it slide up.
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), 500);
    return () => clearTimeout(timer);
  }, [onPlayer, hasTrack]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const el = wrap.current;
    if (!mounted || !shown || !el) {
      root.style.setProperty("--mini-player-h", "0px");
      return undefined;
    }
    const apply = () => root.style.setProperty("--mini-player-h", `${el.offsetHeight}px`);
    apply();
    let observer;
    if (window.ResizeObserver) {
      observer = new window.ResizeObserver(apply);
      observer.observe(el);
    }
    return () => {
      observer?.disconnect();
      root.style.setProperty("--mini-player-h", "0px");
    };
  }, [mounted, shown]);

  // Hidden at once on the player route, so the shared artwork exists only once for the page transition.
  if (onPlayer || !mounted || !last.current) return null;
  const t = last.current;
  const playing = status === "playing" || status === "loading";
  const failed = status === "error";
  const label = failed ? "Try again" : playing ? "Pause" : "Play";

  return (
    <div
      ref={wrap}
      className={`audio-mini pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] ${shown ? "is-shown" : ""}`}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && !shown && !hasTrack) setMounted(false);
      }}
    >
      <section
        role="region"
        aria-label="Now playing"
        className="pointer-events-auto relative mx-auto flex max-w-5xl items-center gap-1 overflow-hidden rounded-t-2xl bg-navy py-2 pl-[max(8px,env(safe-area-inset-left))] pr-[max(8px,env(safe-area-inset-right))] text-white shadow-[0_-4px_16px_rgba(0,0,0,0.35)]"
      >
        <MiniProgress />
        <Link to={audioTrackPath(t)} unstable_viewTransition className="flex min-h-[56px] min-w-0 flex-1 items-center gap-3 rounded-xl pt-1" aria-label={`Open player: ${t.title}`}>
          {t.imageUrl ? (
            <img src={t.imageUrl} alt="" width="48" height="48" className="h-12 w-12 shrink-0 rounded-lg object-cover" style={{ viewTransitionName: "player-art" }} />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/15" style={{ viewTransitionName: "player-art" }}>
              <Icon name="music" size={24} />
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-kannada text-[17px] font-semibold leading-snug" style={{ viewTransitionName: "player-title" }}>
              {t.title}
            </span>
            <span className="flex items-center gap-1.5 text-[15px]">
              {failed ? (
                <span className="font-semibold">Couldn&rsquo;t play. Tap Try again.</span>
              ) : (
                <>
                  <Equalizer playing={status === "playing"} />
                  <span className="truncate font-kannada opacity-90">{status === "loading" ? "Loading…" : t.category}</span>
                </>
              )}
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => {
            haptic();
            actions.toggle();
          }}
          className="flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl pt-1 text-[15px] active:bg-white/15"
        >
          <span className="relative block h-7 w-7">
            <span className={`audio-pp-icon ${playing && !failed ? "" : "is-on"}`}><Icon name="play" size={26} /></span>
            <span className={`audio-pp-icon ${playing && !failed ? "is-on" : ""}`}><Icon name="pause" size={26} /></span>
          </span>
          <span>{label}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            haptic();
            actions.stop();
          }}
          className="flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-0.5 rounded-xl pt-1 text-[15px] active:bg-white/15"
        >
          <Icon name="close" size={26} />
          <span>Close</span>
        </button>
      </section>
    </div>
  );
}
