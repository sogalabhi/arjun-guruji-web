import { Link, useSearchParams } from "react-router-dom";
import Page from "../../layout/Page";
import { useAsync } from "../../hooks/useAsync";
import { getBooks } from "../../data/books";
import { getAstottaras } from "../../data/astottara";
import { getAudioLibrary } from "../../data/audio";
import { categoryImage, getLyrics } from "../../data/lyrics";
import { searchTitles } from "../../data/search";
import SearchBox from "../../components/ui/SearchBox";
import { EmptyState, ErrorState, Skeleton } from "../../components/ui/States";
import { bookPath } from "../books/paths";
import { astottaraPath } from "../astottara/paths";
import { audioTrackPath } from "../audio/paths";
import { lyricPath } from "../lyrics/paths";

// Each source becomes a list of { key, title, subtitle, imageUrl, to } results.
const loadBooks = async () => (await getBooks()).map((b) => ({ key: b.id, title: b.title, imageUrl: b.imageUrl, to: bookPath(b.id) }));
const loadAstottaras = async () => (await getAstottaras()).map((a) => ({ key: a.id, title: a.title, imageUrl: a.imageUrl, to: astottaraPath(a.id) }));
const loadLyrics = async () =>
  (await getLyrics()).map((l) => ({ key: l.id, title: l.title, subtitle: l.category, imageUrl: categoryImage(l.category), to: lyricPath(l) }));
const loadAudio = async () =>
  (await getAudioLibrary()).flatMap((c) =>
    c.tracks.map((t) => ({ key: `${c.id}/${t.id}`, title: t.title, subtitle: c.name, imageUrl: t.imageUrl, to: audioTrackPath(t) })),
  );

// Search across the titles of every book, astottara, audio track and lyric.
export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const setQuery = (q) => setParams(q ? { q } : {}, { replace: true });

  const sections = [
    { title: "Books", source: useAsync(loadBooks, []) },
    { title: "Astottara", source: useAsync(loadAstottaras, []) },
    { title: "Audio", source: useAsync(loadAudio, []) },
    { title: "Lyrics", source: useAsync(loadLyrics, []) },
  ].map((s) => ({ ...s, results: s.source.data ? searchTitles(s.source.data, query) : [] }));

  const searching = query.trim().length > 0;
  const allLoaded = sections.every((s) => s.source.data || s.source.error);
  const nothingFound = allLoaded && sections.every((s) => !s.results.length);
  const allFailed = sections.every((s) => s.source.error);

  return (
    <Page title="Search" variant="gradient" maxWidth="max-w-2xl">
      <div className="mb-5">
        <SearchBox value={query} onChange={setQuery} placeholder="Search titles" autoFocus />
      </div>
      {allFailed ? (
        <ErrorState onRetry={() => sections.forEach((s) => s.source.reload())} />
      ) : !searching ? (
        <EmptyState title="Search books, astottara, audio and lyrics" message="Type in Kannada or in English letters, like guru, sai or sreedhara." />
      ) : nothingFound ? (
        <EmptyState title="Nothing found" message="Try a different word or spelling." />
      ) : (
        <div className="space-y-6">
          {sections.map((s) => (
            <Section key={s.title} title={s.title} source={s.source} results={s.results} />
          ))}
        </div>
      )}
    </Page>
  );
}

function Section({ title, source, results }) {
  if (source.data && !results.length) return null;
  return (
    <section aria-label={title}>
      <h2 className="mb-2 text-[15px] font-semibold uppercase tracking-wide text-white/75">
        {title}
        {results.length > 0 && <span className="ml-2 font-normal normal-case tracking-normal">{results.length}</span>}
      </h2>
      {source.error ? (
        <p className="rounded-2xl bg-white/10 px-3 py-4 text-[15px]">
          Could not load {title.toLowerCase()}.{" "}
          <button type="button" onClick={source.reload} className="min-h-tap font-semibold underline">Try again</button>
        </p>
      ) : !source.data ? (
        <div className="space-y-2" role="status" aria-label={`Loading ${title}`}>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl bg-white/10">
          {results.map((r) => (
            <li key={r.key} className="border-b border-white/15 last:border-0">
              <Link to={r.to} className="flex min-h-[64px] items-center gap-3 px-3 py-2 active:bg-white/10">
                {r.imageUrl ? (
                  <img src={r.imageUrl} alt="" loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                ) : (
                  <span className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-tile to-accent" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-kannada text-[17px] font-semibold leading-snug">{r.title}</span>
                  {r.subtitle && <span className="block font-kannada text-[14px] opacity-75">{r.subtitle}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
