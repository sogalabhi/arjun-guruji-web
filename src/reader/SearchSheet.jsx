import { useEffect, useMemo, useRef, useState } from "react";
import { htmlToText, placeOf } from "./sectionParser";
import { CloseIcon, SearchIcon } from "./icons";

const SNIPPET = 40;

// Searches each section's plain text; picking a result jumps there and
// highlights matches in that section (reader_plan.md §16).
export default function SearchSheet({ sections, initialQuery, onClose, onPick }) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const input = useRef(null);
  const texts = useMemo(
    () => sections.map((s) => htmlToText(`${s.headingHtml ?? ""} ${s.bodyHtml}`).replace(/\s+/g, " ")),
    [sections],
  );

  useEffect(() => {
    input.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (q.length < 2) return [];
    const out = [];
    texts.forEach((text, i) => {
      const lower = text.toLowerCase();
      const at = lower.indexOf(q);
      if (at < 0) return;
      let count = 0;
      for (let k = at; k >= 0; k = lower.indexOf(q, k + q.length)) count++;
      const start = Math.max(0, at - SNIPPET);
      out.push({
        index: i,
        count,
        before: (start > 0 ? "…" : "") + text.slice(start, at),
        match: text.slice(at, at + q.length),
        after: text.slice(at + q.length, at + q.length + SNIPPET) + "…",
      });
    });
    return out;
  }, [q, texts]);

  const multi = sections.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }} role="dialog" aria-modal="true" aria-label="Search">
      <header style={{ background: "var(--bar)", paddingTop: "env(safe-area-inset-top)" }} className="shrink-0">
        <form
          className="mx-auto flex max-w-3xl items-center gap-2 px-2 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (results[0]) onPick(results[0].index, query);
          }}
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl border px-3" style={{ background: "var(--surface)", borderColor: "var(--button-edge)" }}>
            <SearchIcon />
            <input
              ref={input}
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a word"
              aria-label="Type a word"
              className="min-h-tap w-full bg-transparent font-kannada text-lg outline-none"
            />
          </div>
          <button type="button" onClick={onClose} className="flex min-h-tap min-w-tap items-center justify-center" aria-label="Close search">
            <CloseIcon />
          </button>
        </form>
      </header>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-3xl px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2">
          {q.length >= 2 && results.length === 0 && <p className="py-10 text-center" style={{ color: "var(--muted)" }}>No matches found.</p>}
          <ul>
            {results.map((r) => (
              <li key={r.index}>
                <button
                  type="button"
                  onClick={() => onPick(r.index, query)}
                  className="block min-h-[68px] w-full border-b py-3 text-left"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="block text-[14px]" style={{ color: "var(--accent-line)" }}>
                    {multi ? `${placeOf(sections, r.index)} · ` : ""}
                    {r.count} {r.count === 1 ? "match" : "matches"}
                  </span>
                  {multi && <span className="block truncate font-kannada text-[17px] font-semibold">{sections[r.index].title}</span>}
                  <span className="mt-1 block font-kannada text-[15px]" style={{ color: "var(--muted)" }}>
                    {r.before}
                    <mark className="reader-mark">{r.match}</mark>
                    {r.after}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
