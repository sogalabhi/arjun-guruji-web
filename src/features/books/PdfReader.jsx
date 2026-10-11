import { useCallback, useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import Page from "../../layout/Page";
import { ErrorState } from "../../components/ui/States";
import { pdfPageKey } from "./paths";
import "./pdf.css";

GlobalWorkerOptions.workerSrc = workerUrl;

const ZOOMS = [1, 1.25, 1.5, 2, 2.5, 3];
const KEEP = 3; // pages kept drawn on each side of the visible one

function savedPage(id) {
  try {
    const n = parseInt(localStorage.getItem(pdfPageKey(id)) ?? "", 10);
    return Number.isNaN(n) || n < 1 ? 1 : n;
  } catch {
    return 1;
  }
}

// PDF books read inside the site. Pages are drawn onto canvases, so the browser's
// own PDF viewer (with its Download and Print buttons) never opens. The file itself
// is still public, so this deters casual saving rather than preventing it.
export default function PdfReader({ book }) {
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(0);
  const [ratio, setRatio] = useState(1.414); // page height / width, from page 1
  const [zoom, setZoom] = useState(0);
  const [current, setCurrent] = useState(() => savedPage(book.id));
  const [jump, setJump] = useState("");
  const scroller = useRef(null);
  const restored = useRef(false);

  useEffect(() => {
    let task = getDocument({ url: book.pdfUrl, disableAutoFetch: true, rangeChunkSize: 262144, isEvalSupported: false });
    let alive = true;
    setError(null);
    setPdf(null);
    task.onProgress = ({ loaded, total }) => alive && total && setProgress(Math.min(1, loaded / total));
    task.promise.then(
      async (doc) => {
        const first = await doc.getPage(1);
        const v = first.getViewport({ scale: 1 });
        if (!alive) return;
        setRatio(v.height / v.width);
        setPdf(doc);
      },
      (err) => alive && setError(err),
    );
    return () => {
      alive = false;
      task.destroy();
      task = null;
    };
  }, [book.pdfUrl, attempt]);

  const total = pdf?.numPages ?? 0;

  const goTo = useCallback((n, smooth = true) => {
    const el = document.getElementById(`pdf-page-${n}`);
    if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  }, []);

  // Reopen at the saved page once the page boxes exist.
  useEffect(() => {
    if (!pdf || restored.current) return;
    restored.current = true;
    const n = Math.min(savedPage(book.id), pdf.numPages);
    if (n > 1) requestAnimationFrame(() => goTo(n, false));
  }, [pdf, book.id, goTo]);

  // Track the page in view and remember it.
  useEffect(() => {
    if (!pdf) return;
    const seen = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(Number(e.target.dataset.page), e.intersectionRatio);
        let best = 0;
        let bestRatio = 0;
        for (const [n, r] of seen) if (r > bestRatio) [best, bestRatio] = [n, r];
        if (best) setCurrent(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    document.querySelectorAll("[data-page]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pdf]);

  useEffect(() => {
    if (!pdf) return;
    try {
      localStorage.setItem(pdfPageKey(book.id), String(current));
    } catch {
      // ignore
    }
  }, [pdf, current, book.id]);

  const submitJump = (event) => {
    event.preventDefault();
    const n = parseInt(jump, 10);
    if (n >= 1 && n <= total) goTo(n);
    setJump("");
  };

  // Small to look at, but each button still has a 40 px tap area.
  const button = "flex h-10 w-10 items-center justify-center rounded-full text-[22px] leading-none active:bg-white/15 disabled:opacity-30";

  return (
    <Page title={book.title} backTo="/books" variant="gradient" maxWidth="max-w-4xl" className="!px-0">
      {error ? (
        <ErrorState message="This book could not be opened. Please check your internet connection." onRetry={() => setAttempt((n) => n + 1)} />
      ) : !pdf ? (
        <div role="status" className="mx-auto max-w-sm px-4 py-16 text-center">
          <p className="text-[18px] font-semibold">Opening the book…</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20" aria-hidden="true">
            <div className="h-full origin-left bg-tile transition-transform" style={{ transform: `scaleX(${progress || 0.05})` }} />
          </div>
        </div>
      ) : (
        <>
          {/* One slim row under the app bar: page on the left, zoom on the right. */}
          <div className="sticky top-[calc(56px+env(safe-area-inset-top))] z-20 -mt-4 mb-2 flex h-10 items-center justify-between gap-2 bg-navy/85 px-2 text-[15px] backdrop-blur">
            <div className="flex items-center">
              <button type="button" className={button} onClick={() => goTo(current - 1)} disabled={current <= 1} aria-label="Previous page">‹</button>
              <form onSubmit={submitJump} className="flex items-center gap-1">
                <label className="sr-only" htmlFor="pdf-jump">Go to page</label>
                <input id="pdf-jump" inputMode="numeric" value={jump} onChange={(e) => setJump(e.target.value.replace(/\D/g, ""))} placeholder={String(current)} className="h-7 w-11 rounded bg-white/15 text-center text-[16px] placeholder:text-white" />
                <span className="opacity-80">/ {total}</span>
              </form>
              <button type="button" className={button} onClick={() => goTo(current + 1)} disabled={current >= total} aria-label="Next page">›</button>
            </div>
            <div className="flex items-center">
              <button type="button" className={button} onClick={() => setZoom((z) => Math.max(0, z - 1))} disabled={zoom === 0} aria-label="Zoom out">−</button>
              <span className="w-11 text-center tabular-nums opacity-80" aria-live="polite">{Math.round(ZOOMS[zoom] * 100)}%</span>
              <button type="button" className={button} onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))} disabled={zoom === ZOOMS.length - 1} aria-label="Zoom in">+</button>
            </div>
          </div>
          <div ref={scroller} className="pdf-reader overflow-x-auto px-4" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
            <div className="mx-auto space-y-3" style={{ width: `${ZOOMS[zoom] * 100}%`, maxWidth: zoom === 0 ? "100%" : "none" }}>
              {Array.from({ length: total }, (_, i) => (
                <PdfPage key={i} pdf={pdf} number={i + 1} ratio={ratio} draw={Math.abs(i + 1 - current) <= KEEP} zoom={zoom} />
              ))}
            </div>
          </div>
          <p className="pdf-print-note">This book can be read on the website.</p>
        </>
      )}
    </Page>
  );
}

function PdfPage({ pdf, number, ratio, draw, zoom }) {
  const box = useRef(null);
  const canvas = useRef(null);
  const [pageRatio, setPageRatio] = useState(ratio);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!draw) {
      setDrawn(false);
      const c = canvas.current;
      if (c) { c.width = 0; c.height = 0; } // free memory for far-away pages
      return;
    }
    let task;
    let alive = true;
    pdf.getPage(number).then((page) => {
      if (!alive || !box.current || !canvas.current) return;
      const base = page.getViewport({ scale: 1 });
      setPageRatio(base.height / base.width);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: (box.current.clientWidth / base.width) * dpr });
      const c = canvas.current;
      c.width = Math.floor(viewport.width);
      c.height = Math.floor(viewport.height);
      task = page.render({ canvas: c, viewport });
      task.promise.then(() => alive && setDrawn(true), () => {});
    });
    return () => {
      alive = false;
      task?.cancel();
    };
  }, [pdf, number, draw, zoom]);

  return (
    <div id={`pdf-page-${number}`} data-page={number} ref={box} className="relative scroll-mt-32 overflow-hidden rounded-md bg-white shadow-md" style={{ aspectRatio: `1 / ${pageRatio}` }}>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-label={`Page ${number}`} role="img" />
      {!drawn && <span className="absolute inset-0 flex items-center justify-center text-[16px] text-muted">Page {number}</span>}
    </div>
  );
}
