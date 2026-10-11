import "./audio.css";

// Three bouncing bars; they freeze when not playing. Decorative: pair with a text label.
export default function Equalizer({ playing = true, className = "" }) {
  return (
    <span className={`audio-eq ${playing ? "" : "is-paused"} ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
