import Icon from "../../components/ui/Icon";
import { usePlayer } from "../../audio/context";
import { haptic, SKIP_SECONDS } from "../../audio/mediaSession";
import "./audio.css";

const REPEAT_LABEL = { off: "Off", all: "All", one: "One" };

const press = (fn) => () => {
  haptic();
  fn();
};

// −10 s / +10 s, shown between the elapsed and total times under the seek bar so the
// player fits one screen. The visible text is short; screen readers hear the full name.
export function SkipButtons() {
  const { actions } = usePlayer();
  const skip = "audio-skip flex min-h-tap items-center gap-1 rounded-full border-2 border-white/40 bg-white/10 px-2.5 text-[16px] font-semibold transition-transform active:scale-95 active:bg-white/20";
  return (
    <div className="flex shrink-0 gap-2">
      <button type="button" onClick={press(() => actions.skip(-SKIP_SECONDS))} className={skip} style={{ "--rot": "-30deg" }}>
        <span className="audio-skip-icon"><Icon name="rewind10" size={20} /></span>
        <span aria-hidden="true">−10 s</span>
        <span className="sr-only">Back 10 seconds</span>
      </button>
      <button type="button" onClick={press(() => actions.skip(SKIP_SECONDS))} className={skip} style={{ "--rot": "30deg" }}>
        <span aria-hidden="true">+10 s</span>
        <span className="sr-only">Forward 10 seconds</span>
        <span className="audio-skip-icon"><Icon name="forward10" size={20} /></span>
      </button>
    </div>
  );
}

// Row 1: Previous, Play/Pause, Next. Row 2: Shuffle and Repeat toggles.
// Every control has a visible text label.
export default function PlayerControls() {
  const { status, shuffle, repeat, actions } = usePlayer();
  const playing = status === "playing" || status === "loading";
  const loading = status === "loading";
  const failed = status === "error";

  const side = "flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[16px] leading-tight transition-transform active:scale-95 active:bg-white/15";

  return (
    <div className="mt-2 shrink-0">
      <div className="grid grid-cols-3 items-center">
        <button type="button" onClick={press(actions.previous)} className={side}>
          <Icon name="previous" size={30} />
          <span>Previous</span>
        </button>
        <button type="button" onClick={press(actions.toggle)} className="flex flex-col items-center gap-1 rounded-2xl py-1 text-[16px]">
          <span className="audio-play relative block rounded-full bg-tile text-navy shadow-lg">
            <span className={`audio-pp-icon ${playing && !failed ? "" : "is-on"}`}><Icon name="play" size={36} /></span>
            <span className={`audio-pp-icon ${playing && !failed ? "is-on" : ""}`}><Icon name="pause" size={36} /></span>
            {loading && <span className="audio-ring" aria-hidden="true" />}
          </span>
          <span>{failed ? "Try again" : playing ? "Pause" : "Play"}</span>
        </button>
        <button type="button" onClick={press(actions.next)} className={side}>
          <Icon name="next" size={30} />
          <span>Next</span>
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={shuffle}
          onClick={press(actions.toggleShuffle)}
          className={`audio-pill flex min-h-tap items-center justify-center gap-2 rounded-full border-2 px-3 py-2 text-[16px] font-semibold ${shuffle ? "border-tile bg-tile text-navy" : "border-white/50 bg-white/10 text-white"}`}
        >
          <Icon name="shuffle" size={22} />
          <span>Shuffle: {shuffle ? "On" : "Off"}</span>
        </button>
        <button
          type="button"
          aria-pressed={repeat !== "off"}
          onClick={press(actions.cycleRepeat)}
          className={`audio-pill flex min-h-tap items-center justify-center gap-2 rounded-full border-2 px-3 py-2 text-[16px] font-semibold ${repeat !== "off" ? "border-tile bg-tile text-navy" : "border-white/50 bg-white/10 text-white"}`}
        >
          <span key={repeat} className="audio-pop inline-flex"><Icon name={repeat === "one" ? "repeatOne" : "repeat"} size={22} /></span>
          <span>Repeat: {REPEAT_LABEL[repeat]}</span>
        </button>
      </div>
    </div>
  );
}
