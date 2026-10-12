import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { lastLabel, parseSections, placeOf } from "./sectionParser";
import { FONT_STEPS, THEMES, stepIndex, useReaderSettings } from "./settings";
import { clearMarks, highlight } from "./highlight";
import ContentsSheet from "./ContentsSheet";
import SearchSheet from "./SearchSheet";
import { ChevronLeft, ChevronRight, ChevronUp, ListIcon, SearchIcon, SunIcon, BookIcon, MoonIcon } from "./icons";
import "./reader.css";

const clean = (html) => DOMPurify.sanitize(html ?? "", { USE_PROFILES: { html: true } });
const THEME_NAMES = { light: "Light background", sepia: "Sepia background", dark: "Dark background" };
const THEME_ICONS = { light: SunIcon, sepia: BookIcon, dark: MoonIcon };
const BAR_COLORS = { light: "#F2EADC", sepia: "#EADFC6", dark: "#1E1A16" };
const READING_LINE = 0.3;

function loadPosition(key) {
  try {
    return JSON.parse(localStorage.getItem(`reader-pos:${key}`) ?? "null");
  } catch {
    return null;
  }
}
function savePosition(key, pos) {
  try {
    localStorage.setItem(`reader-pos:${key}`, JSON.stringify(pos));
  } catch {
    // ignore
  }
}

/**
 * Long-text reader, ported from the app's ReaderPage (lib/core/reader).
 * One section: plain reader. Two or more (split at <hr>): numbered sections,
 * location bar, Contents, and it remembers where you stopped.
 */
export default function Reader({ title, html, storageKey, backTo = "/", footer = null, splitOnHr = true }) {
  const navigate = useNavigate();
  const { settings, update } = useReaderSettings();
  const sections = useMemo(() => parseSections(html, { split: splitOnHr }), [html, splitOnHr]);
  const rendered = useMemo(
    () => sections.map((s) => ({ heading: s.headingHtml ? clean(s.headingHtml) : null, body: clean(s.bodyHtml) })),
    [sections],
  );
  const multi = sections.length >= 2;
  const max = lastLabel(sections);

  const [current, setCurrent] = useState({ index: 0, r: 0 });
  const [contentsOpen, setContentsOpen] = useState(multi);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [hasMarks, setHasMarks] = useState(false);
  const [hasProgress, setHasProgress] = useState(false);
  const [toast, setToast] = useState(null);

  const textRoot = useRef(null);
  const sectionEls = useRef([]);
  const posRef = useRef({ index: 0, r: 0 });
  const restoring = useRef(true);
  const saveTimer = useRef(null);
  const toastTimer = useRef(null);

  // Page title and Safari's bar colour follow the reader.
  useEffect(() => {
    document.title = `${title} · Arjun Guruji`;
  }, [title]);
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const before = meta?.getAttribute("content");
    meta?.setAttribute("content", BAR_COLORS[settings.theme]);
    return () => before && meta?.setAttribute("content", before);
  }, [settings.theme]);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 1600);
  }, []);

  const sectionTop = (el) => el.getBoundingClientRect().top + window.scrollY;

  const scrollToPosition = useCallback(({ index, r }) => {
    const el = sectionEls.current[index];
    if (!el) return;
    const y = sectionTop(el) + r * el.offsetHeight - window.innerHeight * READING_LINE;
    window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
  }, []);

  // Which section crosses the reading line, and how far through it (§7).
  const measure = useCallback(() => {
    const els = sectionEls.current.filter(Boolean);
    if (!els.length) return;
    const line = window.scrollY + window.innerHeight * READING_LINE;
    const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    let index = 0;
    let r = 1;
    if (atEnd && window.scrollY > 0) {
      index = els.length - 1;
    } else {
      for (let i = 0; i < els.length; i++) {
        if (sectionTop(els[i]) <= line) index = i;
        else break;
      }
      const el = els[index];
      r = Math.min(1, Math.max(0, (line - sectionTop(el)) / Math.max(el.offsetHeight, 1)));
    }
    posRef.current = { index, r };
    setCurrent((c) => (c.index === index && Math.abs(c.r - r) < 0.005 ? c : { index, r }));
    if (!restoring.current && storageKey) {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        savePosition(storageKey, { index, r, title: sections[index]?.title });
        if (index > 0 || r > 0.02) setHasProgress(true);
      }, 400);
    }
  }, [sections, storageKey]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure]);

  // Resume where the reader stopped (§12): match by index + title, else by title.
  useEffect(() => {
    restoring.current = true;
    let cancelled = false;
    const saved = multi && storageKey ? loadPosition(storageKey) : null;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      if (saved) {
        let index = sections[saved.index]?.title === saved.title ? saved.index : sections.findIndex((s) => s.title === saved.title);
        if (index < 0) index = Math.min(saved.index ?? 0, sections.length - 1);
        scrollToPosition({ index, r: saved.r ?? 0 });
        setHasProgress(index > 0 || (saved.r ?? 0) > 0.02);
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      measure();
      restoring.current = false;
    });
    return () => {
      cancelled = true;
      clearTimeout(saveTimer.current);
    };
  }, [sections, storageKey, multi, measure, scrollToPosition]);

  // Text size or font change: stay on the same line (§11).
  const firstLayout = useRef(true);
  useLayoutEffect(() => {
    if (firstLayout.current) {
      firstLayout.current = false;
      return;
    }
    scrollToPosition(posRef.current);
  }, [settings.fontSize, settings.fontStyle, scrollToPosition]);

  const arrive = (index) => {
    const el = sectionEls.current[index];
    if (!el) return;
    el.classList.remove("reader-arrive");
    void el.offsetWidth; // restart the animation
    el.classList.add("reader-arrive");
    setTimeout(() => el.classList.remove("reader-arrive"), 2000);
  };

  const jump = useCallback((index) => {
    const el = sectionEls.current[index];
    if (!el) return;
    setContentsOpen(false);
    el.scrollIntoView({ block: "start", behavior: "instant" });
    arrive(index);
  }, []);

  const closeContents = useCallback(() => setContentsOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const pickResult = (index, query) => {
    setSearchOpen(false);
    setLastQuery(query);
    clearMarks(textRoot.current);
    const root = multi ? sectionEls.current[index] : textRoot.current;
    const first = highlight(root, query);
    setHasMarks(Boolean(first));
    if (first) first.scrollIntoView({ block: "center", behavior: "instant" });
    if (multi) arrive(index);
  };

  const clearHighlights = () => {
    clearMarks(textRoot.current);
    setHasMarks(false);
  };

  const k = stepIndex(settings.fontSize);
  const setSize = (step) => {
    update({ fontSize: FONT_STEPS[step] });
    showToast(`Text size ${step + 1} of ${FONT_STEPS.length}`);
  };
  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(settings.theme) + 1) % THEMES.length];
    update({ theme: next });
    showToast(THEME_NAMES[next]);
  };

  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(backTo);
  };

  const ThemeIcon = THEME_ICONS[settings.theme];
  const fontFamily = settings.fontStyle === "serif" ? "'Noto Serif Kannada', serif" : "'Noto Sans Kannada', sans-serif";
  const empty = !html || !sections.length;

  return (
    <div className="reader" data-theme={settings.theme}>
      <header className="sticky top-0 z-30 border-b" style={{ background: "var(--bar)", borderColor: "var(--line)", paddingTop: "env(safe-area-inset-top)" }}>
        <div className="mx-auto flex h-14 max-w-3xl items-center pl-[max(4px,env(safe-area-inset-left))] pr-[max(4px,env(safe-area-inset-right))]">
          <BarButton label="Back" onClick={goBack}>
            <ChevronLeft />
          </BarButton>
          {multi && (
            <BarButton label="Contents" onClick={() => setContentsOpen(true)}>
              <ListIcon />
            </BarButton>
          )}
          <h1 className="min-w-0 flex-1 truncate px-1 text-center font-kannada text-[17px] font-semibold">{title}</h1>
          {!empty && (
            <BarButton label="Search" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </BarButton>
          )}
          <BarButton label="Change background colour" onClick={cycleTheme}>
            <ThemeIcon />
          </BarButton>
          <BarButton label="Smaller text" disabled={k === 0} onClick={() => setSize(k - 1)}>
            <span className="font-sans text-[15px]">A−</span>
          </BarButton>
          <BarButton label="Larger text" disabled={k === FONT_STEPS.length - 1} onClick={() => setSize(k + 1)}>
            <span className="font-sans text-[19px]">A+</span>
          </BarButton>
        </div>
      </header>

      <main
        ref={textRoot}
        className="mx-auto max-w-[720px] pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] pt-4"
        style={{
          fontSize: settings.fontSize,
          fontFamily,
          paddingBottom: multi ? "calc(var(--bottom-bar-h) + var(--mini-player-h, 0px) + 32px)" : "calc(48px + max(var(--mini-player-h, 0px), env(safe-area-inset-bottom)))",
        }}
      >
        {empty && (
          <div className="py-16 text-center font-sans" role="alert">
            <p className="text-lg">Failed to load content</p>
          </div>
        )}

        {!empty && !multi && (
          <div ref={(el) => (sectionEls.current = [el])}>
            <div className="reader-text" dangerouslySetInnerHTML={{ __html: rendered[0].body }} />
          </div>
        )}

        {multi &&
          sections.map((s, i) => (
            <section key={s.number} ref={(el) => (sectionEls.current[i] = el)} className="reader-section pt-[34px]" aria-label={s.title}>
              <div className="reader-heading rounded-xl pb-2">
                <div className="flex items-center gap-3" aria-hidden="true">
                  <span className="h-px flex-1" style={{ background: "var(--line)" }} />
                  <span className="reader-circle">{s.label ?? "•"}</span>
                  <span className="h-px flex-1" style={{ background: "var(--line)" }} />
                </div>
                {rendered[i].heading && (
                  <h2 className="mt-3 text-center font-bold" style={{ fontSize: "1.15em" }} dangerouslySetInnerHTML={{ __html: rendered[i].heading }} />
                )}
              </div>
              <div className="reader-section-body reader-text mt-3" dangerouslySetInnerHTML={{ __html: rendered[i].body }} />
              {i < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={() => jump(i + 1)}
                  className="mt-4 flex min-h-[70px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left font-sans"
                  style={{ background: "var(--surface)", borderColor: "var(--line)" }}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px]" style={{ color: "var(--accent-line)" }}>
                      Next · {placeOf(sections, i + 1)}
                    </span>
                    <span className="block truncate font-kannada text-[17px]">{sections[i + 1].title}</span>
                  </span>
                  <ChevronRight />
                </button>
              ) : (
                <div className="mt-6 rounded-2xl border px-4 py-5 text-center font-sans" style={{ background: "var(--surface)", borderColor: "var(--line)" }}>
                  <p className="text-lg">End of book</p>
                  <button
                    type="button"
                    onClick={() => setContentsOpen(true)}
                    className="mt-3 min-h-tap rounded-xl border px-5"
                    style={{ borderColor: "var(--button-edge)" }}
                  >
                    Back to contents
                  </button>
                </div>
              )}
            </section>
          ))}

        {!empty && footer && <div className="mt-8 font-sans">{footer}</div>}
      </main>

      {multi && (
        <LocationBar
          sections={sections}
          current={current}
          max={max}
          onPrev={() => jump(Math.max(0, current.index - 1))}
          onNext={() => jump(Math.min(sections.length - 1, current.index + 1))}
          onContents={() => setContentsOpen(true)}
        />
      )}

      {hasMarks && (
        <button
          type="button"
          onClick={clearHighlights}
          className="fixed left-1/2 z-40 min-h-tap -translate-x-1/2 rounded-full px-5 font-sans text-[15px] shadow-lg"
          style={{ background: "var(--bubble-bg)", color: "var(--bubble-fg)", bottom: multi ? "calc(var(--bottom-bar-h) + var(--mini-player-h, 0px) + 12px)" : "calc(16px + max(var(--mini-player-h, 0px), env(safe-area-inset-bottom)))" }}
        >
          Clear highlights
        </button>
      )}

      <div
        aria-live="polite"
        className={`reader-toast pointer-events-none fixed left-1/2 top-[calc(var(--top-bar-h)+12px)] z-40 -translate-x-1/2 rounded-full px-4 py-2 font-sans text-[15px] ${toast ? "opacity-100" : "-translate-y-2 opacity-0"}`}
        style={{ background: "var(--bubble-bg)", color: "var(--bubble-fg)" }}
      >
        {toast}
      </div>

      {contentsOpen && multi && (
        <ContentsSheet
          bookTitle={title}
          sections={sections}
          currentIndex={current.index}
          hasProgress={hasProgress}
          onClose={closeContents}
          onJump={jump}
        />
      )}
      {searchOpen && <SearchSheet sections={sections} initialQuery={lastQuery} onClose={closeSearch} onPick={pickResult} />}
    </div>
  );
}

function BarButton({ label, onClick, disabled = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex min-h-tap min-w-tap shrink-0 items-center justify-center rounded-full active:bg-black/10 disabled:opacity-35"
    >
      {children}
    </button>
  );
}

// Progress strip + previous / "14 of 29" / next (reader_plan.md §8).
function LocationBar({ sections, current, max, onPrev, onNext, onContents }) {
  const { index, r } = current;
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t font-sans"
      style={{ background: "var(--bar)", borderColor: "var(--line)", bottom: "var(--mini-player-h, 0px)", paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Reading position"
    >
      <div className="flex h-[5px] gap-[2px]" aria-hidden="true">
        {sections.map((s, i) => (
          <span key={s.number} className="relative overflow-hidden" style={{ flex: Math.max(s.length, 400), background: "var(--line)" }}>
            <span
              className="absolute inset-y-0 left-0"
              style={{ background: "var(--accent-line)", width: i < index ? "100%" : i === index ? `${r * 100}%` : "0%" }}
            />
          </span>
        ))}
      </div>
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-[max(8px,env(safe-area-inset-left))] py-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Previous section"
          className="flex h-[58px] w-[56px] shrink-0 items-center justify-center rounded-xl border disabled:opacity-35"
          style={{ borderColor: "var(--button-edge)" }}
        >
          <ChevronLeft />
        </button>
        <button type="button" onClick={onContents} className="min-w-0 flex-1 rounded-xl px-2 py-1 text-center" aria-label="Open contents">
          <span className="flex items-center justify-center gap-1 text-[14px]" style={{ color: "var(--accent-line)" }}>
            {placeOf(sections, index)} of {max} · Contents <ChevronUp />
          </span>
          <span className="block truncate font-kannada text-[17px]">{sections[index]?.title}</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === sections.length - 1}
          aria-label="Next section"
          className="flex h-[58px] w-[56px] shrink-0 items-center justify-center rounded-xl border disabled:opacity-35"
          style={{ borderColor: "var(--button-edge)" }}
        >
          <ChevronRight />
        </button>
      </div>
    </nav>
  );
}
