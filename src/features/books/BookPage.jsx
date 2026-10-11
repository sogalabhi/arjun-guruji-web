import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import Page from "../../layout/Page";
import Reader from "../../reader/Reader";
import { useAsync } from "../../hooks/useAsync";
import { bookKind, getBook } from "../../data/books";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";
import { chapterPath, lastChapterKey } from "./paths";

// pdf.js is large, so it loads only when a PDF book is opened.
const PdfReader = lazy(() => import("./PdfReader"));

// /books/:bookId — html book → reader, chapters book → chapter list, pdf → in-site PDF reader.
export default function BookPage() {
  const { bookId } = useParams();
  const { data: book, error, loading, reload } = useAsync(() => getBook(bookId), [bookId]);

  if (error) return <Page title="Books" backTo="/books" variant="gradient"><ErrorState onRetry={reload} /></Page>;
  if (loading && !book) return <Page title="" backTo="/books" variant="gradient"><SkeletonList /></Page>;
  if (!book) return <Page title="Books" backTo="/books" variant="gradient"><EmptyState title="Book not found" message="It may have been removed." /></Page>;

  const kind = bookKind(book);
  if (kind === "html") return <Reader key={book.id} title={book.title} html={book.html} storageKey={`book:${book.id}`} backTo="/books" />;
  if (kind === "chapters") return <ChapterList book={book} />;
  return <PdfBook book={book} />;
}

function readLastChapter(id) {
  try {
    const n = parseInt(localStorage.getItem(lastChapterKey(id)) ?? "", 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

function ChapterList({ book }) {
  const last = readLastChapter(book.id);
  const lastChapter = last && book.chapters[last - 1];
  return (
    <Page title={book.title} backTo="/books" variant="gradient">
      {lastChapter && (
        <Link to={chapterPath(book.id, last)} className="mb-4 block rounded-2xl bg-tile px-4 py-4 text-ink shadow-md active:opacity-90">
          <span className="block text-[15px]">Continue reading</span>
          <span className="block truncate font-kannada text-lg font-semibold">
            {last} · {lastChapter.title}
          </span>
        </Link>
      )}
      <ol className="overflow-hidden rounded-2xl bg-white/10">
        {book.chapters.map((c, i) => (
          <li key={i} className="border-b border-white/15 last:border-0">
            <Link to={chapterPath(book.id, i + 1)} className="flex min-h-[64px] items-center gap-3 px-4 py-3 active:bg-white/10">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 text-[15px]">{i + 1}</span>
              <span className="min-w-0 flex-1 font-kannada text-[17px] leading-snug">{c.title}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 opacity-60" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          </li>
        ))}
      </ol>
    </Page>
  );
}

function PdfBook({ book }) {
  if (!book.pdfUrl) {
    return (
      <Page title={book.title} backTo="/books" variant="gradient">
        <EmptyState title="Not available yet" message="This book is not available to read yet." />
      </Page>
    );
  }
  return (
    <Suspense fallback={<Page title={book.title} backTo="/books" variant="gradient"><SkeletonList /></Page>}>
      <PdfReader book={book} />
    </Suspense>
  );
}
