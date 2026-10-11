import { useEffect, useRef, useState } from "react";
import { indexOfLabel, kannadaToAsciiDigits, lastLabel, placeOf } from "./sectionParser";
import { ChevronDown } from "./icons";

// Full-screen Contents, sliding up over the reader (reader_plan.md §9).
export default function ContentsSheet({ bookTitle, sections, currentIndex, hasProgress, onClose, onJump }) {
  const [shown, setShown] = useState(false);
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const currentRow = useRef(null);
  const max = lastLabel(sections);
  const current = sections[currentIndex];

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    currentRow.current?.scrollIntoView({ block: "center" });
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const go = (e) => {
    e.preventDefault();
    const n = parseInt(kannadaToAsciiDigits(number.trim()), 10);
    const index = Number.isNaN(n) ? null : indexOfLabel(sections, n);
    if (index == null) {
      setError(`Enter a number from 1 to ${max}.`);
      return;
    }
    setError("");
    onJump(index);
  };

  return (
    <div
      className={`reader-sheet fixed inset-0 z-50 flex flex-col ${shown ? "translate-y-0" : "translate-y-full"}`}
      style={{ background: "var(--bg)", color: "var(--ink)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Contents"
    >
      <header style={{ background: "var(--bar)", paddingTop: "env(safe-area-inset-top)" }} className="shrink-0">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-2 py-2">
          <button type="button" onClick={onClose} className="flex min-h-tap items-center gap-1 rounded-xl px-2" aria-label="Back to reading">
            <ChevronDown />
            <span className="text-[15px]">Back to reading</span>
          </button>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <h2 className="text-2xl">Contents</h2>
          <p className="font-kannada text-[15px]" style={{ color: "var(--muted)" }}>
            {bookTitle} · {sections.length} sections
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-3xl px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            <span className="flex-1">
              <span className="block text-[15px]">{hasProgress ? "Continue reading" : "Start reading"}</span>
              <span className="block truncate font-kannada text-lg font-semibold">
                {placeOf(sections, currentIndex)} · {current?.title}
              </span>
            </span>
          </button>

          <form onSubmit={go} className="mt-4">
            <label htmlFor="goto" className="text-[15px]" style={{ color: "var(--muted)" }}>
              Go to number
            </label>
            <div className="mt-1 flex gap-2">
              <input
                id="goto"
                inputMode="numeric"
                autoComplete="off"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder={`1 – ${max}`}
                className="min-h-tap w-full rounded-xl border px-4 text-lg"
                style={{ background: "var(--surface)", borderColor: "var(--button-edge)", color: "var(--ink)" }}
              />
              <button type="submit" className="min-h-tap min-w-[72px] rounded-xl px-4 text-lg" style={{ background: "var(--accent)", color: "var(--on-accent)" }}>
                Go
              </button>
            </div>
            {error && <p className="mt-2 text-[15px]" role="alert">{error}</p>}
          </form>

          <ol className="mt-5">
            {sections.map((s, i) => {
              const isCurrent = i === currentIndex;
              return (
                <li key={s.number} ref={isCurrent ? currentRow : null}>
                  <button
                    type="button"
                    onClick={() => onJump(i)}
                    className="flex min-h-[68px] w-full items-center gap-3 border-b px-2 py-2 text-left"
                    style={{ borderColor: "var(--line)", background: isCurrent ? "var(--accent-wash)" : "transparent" }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-sans text-[15px]"
                      style={
                        isCurrent
                          ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" }
                          : { borderColor: "var(--button-edge)" }
                      }
                    >
                      {s.label ?? "•"}
                    </span>
                    <span className="min-w-0 flex-1">
                      {isCurrent && (
                        <span className="block text-[13px]" style={{ color: "var(--accent-line)" }}>
                          Now reading
                        </span>
                      )}
                      <span className="line-clamp-2 font-kannada text-[17px]">{s.title}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
