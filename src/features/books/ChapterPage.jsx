import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Page from "../../layout/Page";
import Reader from "../../reader/Reader";
import { useAsync } from "../../hooks/useAsync";
import { getBook } from "../../data/books";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";
import { bookPath, chapterPath, lastChapterKey } from "./paths";

// /books/:bookId/:chapter (1-based)
export default function ChapterPage() {
  const { bookId, chapter } = useParams();
  const n = parseInt(chapter, 10);
  const { data: book, error, loading, reload } = useAsync(() => getBook(bookId), [bookId]);
  const current = book?.chapters?.[n - 1];

  useEffect(() => {
    if (!current) return;
    try {
      localStorage.setItem(lastChapterKey(bookId), String(n));
    } catch {
      // ignore
    }
  }, [bookId, n, current]);

  if (error) return <Page title="Books" backTo={bookPath(bookId)} variant="gradient"><ErrorState onRetry={reload} /></Page>;
  if (loading && !book) return <Page title="" backTo={bookPath(bookId)} variant="gradient"><SkeletonList /></Page>;
  if (!current) return <Page title={book?.title ?? "Books"} backTo={bookPath(bookId)} variant="gradient"><EmptyState title="Chapter not found" /></Page>;

  const prev = n > 1 ? book.chapters[n - 2] : null;
  const next = n < book.chapters.length ? book.chapters[n] : null;

  const footer = (
    <nav className="grid gap-3" aria-label="Chapters">
      {next && <ChapterLink to={chapterPath(bookId, n + 1)} label={`Next chapter · ${n + 1}`} title={next.title} primary />}
      {prev && <ChapterLink to={chapterPath(bookId, n - 1)} label={`Previous chapter · ${n - 1}`} title={prev.title} />}
      <Link to={bookPath(bookId)} className="flex min-h-tap items-center justify-center rounded-2xl border px-4 py-3" style={{ borderColor: "var(--button-edge)" }}>
        All chapters
      </Link>
    </nav>
  );

  return (
    <Reader
      key={`${bookId}/${n}`}
      title={current.title}
      html={current.html}
      storageKey={`book:${bookId}:${n}`}
      backTo={bookPath(bookId)}
      footer={footer}
    />
  );
}

function ChapterLink({ to, label, title, primary = false }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border px-4 py-3"
      style={primary ? { background: "var(--accent)", color: "var(--on-accent)", borderColor: "var(--accent)" } : { background: "var(--surface)", borderColor: "var(--line)" }}
    >
      <span className="block text-[14px]">{label}</span>
      <span className="block truncate font-kannada text-[17px] font-semibold">{title}</span>
    </Link>
  );
}
