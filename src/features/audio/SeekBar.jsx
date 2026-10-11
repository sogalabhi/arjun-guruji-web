import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer, usePlayerTime } from "../../audio/context";
import { formatTime, spokenTime } from "../../audio/time";
import "./audio.css";

// Range input over custom rails: buffered (soft) and played (yellow) fills, a time
// bubble while dragging, and elapsed / total text under it with `children` between them.
// Only this component re-renders on every time update.
export default function SeekBar({ children }) {
  const { actions } = usePlayer();
  const { position, duration, buffered } = usePlayerTime();
  const [drag, setDrag] = useState(null); // seconds while the thumb is held, else null
  const dragRef = useRef(null);
  const stopListening = useRef(null);

  const finishDrag = useCallback(() => {
    stopListening.current?.();
    stopListening.current = null;
    if (dragRef.current !== null) actions.seek(dragRef.current);
    dragRef.current = null;
    setDrag(null);
  }, [actions]);

  // If the page goes away mid-drag, drop the window listeners.
  useEffect(() => () => stopListening.current?.(), []);

  const onPointerDown = () => {
    dragRef.current = position;
    setDrag(position);
    const up = () => finishDrag();
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    stopListening.current = () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  };

  const onChange = (event) => {
    const value = Number(event.target.value);
    if (dragRef.current !== null) {
      dragRef.current = value;
      setDrag(value);
    } else {
      actions.seek(value); // keyboard
    }
  };

  const max = Math.max(1, Math.floor(duration));
  const shown = Math.min(drag ?? position, duration || max);
  const fraction = (value) => (duration > 0 ? Math.min(Math.max(value / duration, 0), 1) : 0);

  return (
    <div>
      <div className="audio-seek">
        <div className="audio-seek-rail" aria-hidden="true">
          <div className="audio-seek-buffered" style={{ transform: `scaleX(${fraction(buffered)})` }} />
          <div className="audio-seek-played" style={{ transform: `scaleX(${fraction(shown)})` }} />
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={Math.min(Math.floor(shown), max)}
          onPointerDown={onPointerDown}
          onChange={onChange}
          aria-label="Seek"
          aria-valuetext={`${spokenTime(shown)} of ${spokenTime(duration)}`}
        />
        {drag !== null && (
          <span className="audio-seek-bubble" style={{ left: `calc(10px + (100% - 20px) * ${fraction(drag)})` }} aria-hidden="true">
            {formatTime(drag)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-[16px] tabular-nums">
        <span>
          <span className="sr-only">Elapsed </span>
          {formatTime(shown)}
        </span>
        {children}
        <span>
          <span className="sr-only">Total </span>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
