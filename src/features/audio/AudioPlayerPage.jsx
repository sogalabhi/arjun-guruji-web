import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Page from "../../layout/Page";
import Icon from "../../components/ui/Icon";
import { useAsync } from "../../hooks/useAsync";
import { getAudioLibrary } from "../../data/audio";
import { usePlayer } from "../../audio/context";
import { SKIP_SECONDS } from "../../audio/mediaSession";
import { useReaderSettings } from "../../reader/settings";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";
import SeekBar from "./SeekBar";
import PlayerControls, { SkipButtons } from "./PlayerControls";
import Equalizer from "./Equalizer";
import { audioCategoryPath, audioTrackPath } from "./paths";
import "./audio.css";

const VIEWS = [
  ["art", "Image"],
  ["lyrics", "Lyrics"],
  ["queue", "Up next"],
];

const keyOf = (track) => (track ? `${track.categoryId}/${track.id}` : null);

export default function AudioPlayerPage() {
  const { categoryId, trackId } = useParams();
  const navigate = useNavigate();
  const player = usePlayer();
  const { actions, track: playerTrack } = player;
  const { data: library, error, reload } = useAsync(getAudioLibrary, []);
  const [view, setView] = useState("art");
  const [switched, setSwitched] = useState(false); // panels animate only after the listener changes the view

  const category = library?.find((c) => c.id === categoryId);
  const urlIndex = category ? category.tracks.findIndex((t) => t.id === trackId) : -1;
  const urlTrack = urlIndex >= 0 ? category.tracks[urlIndex] : null;

  // The player already has this track (tapped from a list, or reopened from the mini player)?
  const matches = Boolean(playerTrack) && playerTrack.id === trackId && playerTrack.categoryId === categoryId;
  const track = matches ? playerTrack : urlTrack;
  const status = matches ? player.status : "paused";
  const trackKey = keyOf(track);

  // Opened from a link with something else (or nothing) loaded: load this track paused.
  // Browsers block autoplay, so the listener taps Play.
  useLayoutEffect(() => {
    if (!category || !urlTrack) return;
    const now = actions.current().track;
    if (now && now.id === urlTrack.id && now.categoryId === urlTrack.categoryId) return;
    actions.load(category.tracks, urlIndex);
  }, [actions, category, urlTrack, urlIndex]);

  // When the track changes by itself (Next, auto-advance, Up next), keep the shareable URL in step.
  const seenPlayerKey = useRef(keyOf(playerTrack));
  useEffect(() => {
    const key = keyOf(playerTrack);
    if (key === seenPlayerKey.current) return;
    seenPlayerKey.current = key;
    if (playerTrack && (playerTrack.id !== trackId || playerTrack.categoryId !== categoryId)) {
      navigate(audioTrackPath(playerTrack), { replace: true });
    }
  }, [playerTrack, trackId, categoryId, navigate]);

  // Art and title slide in from the direction of travel, but not on first load.
  const [seenKey, setSeenKey] = useState(trackKey);
  const [slide, setSlide] = useState("");
  if (trackKey !== seenKey) {
    setSeenKey(trackKey);
    if (seenKey !== null && trackKey !== null) setSlide(player.direction >= 0 ? "audio-slide-next" : "audio-slide-prev");
  }

  // Space plays / pauses and the arrow keys skip 10 s, unless a field or button has the keys.
  useEffect(() => {
    const onKey = (e) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (e.key === " " || e.code === "Space") {
        if (target?.closest("button, a, [role='button']")) return;
        e.preventDefault();
        actions.toggle();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        actions.skip(-SKIP_SECONDS);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        actions.skip(SKIP_SECONDS);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actions]);

  const list = matches ? player.queue.tracks : (category?.tracks ?? []);
  const currentIndex = matches ? player.index : urlIndex;
  const playing = status === "playing" || status === "loading";

  let body;
  if (track) {
    // In portrait everything shares one screen height: the image or the lyrics / queue
    // panel takes whatever space the fixed rows leave (audio.css, .page-fit).
    body = (
      <div className="audio-stage">
        <Segmented
          view={view}
          onChange={(next) => {
            setSwitched(true);
            setView(next);
          }}
        />
        <div key={view} className={`audio-grow mt-3 ${switched ? "audio-panel-in" : ""}`}>
          {view === "art" && <ArtPanel track={track} playing={playing} slide={slide} trackKey={trackKey} />}
          {view === "lyrics" && <LyricsPanel track={track} />}
          {view === "queue" && <QueuePanel list={list} currentIndex={currentIndex} status={status} onPick={(i) => actions.play(list, i)} />}
        </div>
        <p className="sr-only" aria-live="polite">
          {status === "error" ? "" : `${playing ? "Now playing" : "Paused"}: ${track.title}`}
        </p>
        {status === "error" && (
          <div role="alert" className="mt-3 flex shrink-0 items-center gap-3 rounded-2xl border-2 border-white/60 bg-black/40 p-3">
            <p className="min-w-0 flex-1 text-[16px]">
              <span className="font-semibold">Couldn&rsquo;t play this track.</span> Check your internet.
            </p>
            <button type="button" onClick={actions.retry} className="min-h-tap shrink-0 rounded-xl bg-tile px-4 text-[16px] font-semibold text-navy active:opacity-80">
              Try again
            </button>
          </div>
        )}
        <div className="mt-3 shrink-0">
          <SeekBar>
            <SkipButtons />
          </SeekBar>
        </div>
        <PlayerControls />
      </div>
    );
  } else if (error) {
    body = <ErrorState message="Audio needs an internet connection." onRetry={reload} />;
  } else if (!library) {
    body = <SkeletonList rows={4} />;
  } else {
    body = (
      <div className="text-center">
        <EmptyState title="Track not found" message="This audio link may be old." />
        <Link to={audioCategoryPath(categoryId)} className="inline-flex min-h-[56px] items-center rounded-xl bg-tile px-6 text-[18px] font-semibold text-navy">
          See the audio list
        </Link>
      </div>
    );
  }

  return (
    <Page title="Audio player" docTitle={track?.title} backTo={audioCategoryPath(categoryId)} variant="overlay" maxWidth="max-w-xl" fit>
      <Backdrop imageUrl={track?.imageUrl ?? ""} trackKey={trackKey} />
      {body}
    </Page>
  );
}

// The artwork, blurred and darkened, behind the whole screen. The previous picture stays
// underneath while the new one fades in.
function Backdrop({ imageUrl, trackKey }) {
  const [layers, setLayers] = useState(() => [{ key: trackKey, url: imageUrl, fade: false }]);
  if (layers[layers.length - 1].key !== trackKey) {
    setLayers([...layers.slice(-1), { key: trackKey, url: imageUrl, fade: true }]);
  }
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-app-bar" aria-hidden="true">
      {layers.map(
        (layer) =>
          layer.url && (
            <img
              key={layer.key}
              src={layer.url}
              alt=""
              className={`absolute inset-0 h-full w-full scale-110 object-cover blur-2xl ${layer.fade ? "audio-fade-in" : ""}`}
            />
          ),
      )}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

function Segmented({ view, onChange }) {
  const active = VIEWS.findIndex(([value]) => value === view);
  return (
    <div role="group" aria-label="Show" className="audio-seg shrink-0 rounded-full bg-black/35" style={{ "--i": active }}>
      <span className="audio-seg-pill rounded-full bg-tile" aria-hidden="true" />
      {VIEWS.map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={`relative z-10 min-h-tap rounded-full px-2 text-[16px] ${view === value ? "font-bold text-navy" : "text-white"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ArtPanel({ track, playing, slide, trackKey }) {
  return (
    <div key={trackKey} className={`audio-grow items-center text-center ${slide}`}>
      {/* The image is a square as large as the space left over allows (audio.css). */}
      <div className="audio-art-box w-full">
        <div className={`audio-art ${playing ? "is-playing" : ""}`} style={{ viewTransitionName: "player-art" }}>
          <span className="audio-art-shadow" />
          {track.imageUrl ? (
            <img src={track.imageUrl} alt="" className="relative aspect-square w-full rounded-2xl object-cover" />
          ) : (
            <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl bg-white/15">
              <Icon name="music" size={64} />
            </div>
          )}
        </div>
      </div>
      <h2 className="mt-3 line-clamp-2 shrink-0 font-kannada text-[22px] font-bold leading-snug" style={{ viewTransitionName: "player-title" }}>
        {track.title}
      </h2>
      <p className="shrink-0 truncate font-kannada text-[16px] opacity-90">{track.category}</p>
    </div>
  );
}

function LyricsPanel({ track }) {
  const fontSize = useReaderSettings()?.settings.fontSize ?? 20;
  return (
    <div role="region" aria-label="Lyrics" tabIndex={0} className="audio-panel overflow-y-auto overscroll-contain rounded-2xl bg-black/30 p-4">
      {track.lyrics ? (
        <p className="whitespace-pre-line font-kannada" style={{ fontSize, lineHeight: 1.8 }}>
          {track.lyrics}
        </p>
      ) : (
        <p className="py-8 text-center text-[18px]">No lyrics for this track</p>
      )}
    </div>
  );
}

function QueuePanel({ list, currentIndex, status, onPick }) {
  const box = useRef(null);
  const row = useRef(null);

  // Open with the current track in the middle.
  useEffect(() => {
    if (box.current && row.current) {
      box.current.scrollTop = row.current.offsetTop - box.current.clientHeight / 2 + row.current.offsetHeight / 2;
    }
  }, []);

  return (
    <ul ref={box} aria-label="Up next" className="audio-panel relative overflow-y-auto overscroll-contain rounded-2xl bg-black/30">
      {list.map((t, i) => {
        const isCurrent = i === currentIndex;
        return (
          <li key={t.id} ref={isCurrent ? row : null} className="border-b border-white/15 last:border-0">
            <button
              type="button"
              onClick={() => onPick(i)}
              aria-current={isCurrent ? "true" : undefined}
              className={`flex min-h-[56px] w-full items-center gap-3 px-3 py-2 text-left ${isCurrent ? "bg-white/20" : "active:bg-white/10"}`}
            >
              <span className="w-7 shrink-0 text-center text-[16px] tabular-nums opacity-80">{i + 1}</span>
              <span className="min-w-0 flex-1 font-kannada text-[17px] font-semibold leading-snug">{t.title}</span>
              {isCurrent && (
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[16px] font-semibold">
                  <Equalizer playing={status === "playing" || status === "loading"} />
                  {status === "playing" ? "Playing" : status === "loading" ? "Loading" : "Paused"}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
