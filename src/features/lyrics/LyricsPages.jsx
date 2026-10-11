import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Page from "../../layout/Page";
import Reader from "../../reader/Reader";
import { useAsync } from "../../hooks/useAsync";
import { categoryImage, getLyric, getLyricCategories, getLyrics } from "../../data/lyrics";
import { TileGrid, TileGridSkeleton } from "../../components/ui/ImageTile";
import SearchBox, { matches } from "../../components/ui/SearchBox";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";

const categoryPath = (c) => `/lyrics/${encodeURIComponent(c)}`;
const lyricPath = (l) => `${categoryPath(l.category)}/${encodeURIComponent(l.id)}`;

// Categories, plus a search across every lyric title.
export function LyricsCategoriesPage() {
  const categories = useAsync(getLyricCategories, []);
  const lyrics = useAsync(getLyrics, []);
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  const found = searching ? (lyrics.data ?? []).filter((l) => matches(l.title, query)) : [];

  return (
    <Page title="Lyrics" variant="gradient">
      <div className="mb-4">
        <SearchBox value={query} onChange={setQuery} placeholder="Search all lyrics" />
      </div>
      {categories.error ? (
        <ErrorState onRetry={categories.reload} />
      ) : searching ? (
        found.length ? <LyricList items={found} showCategory /> : <EmptyState title="No lyrics found" message="Try a different word." />
      ) : !categories.data ? (
        <TileGridSkeleton count={3} />
      ) : (
        <TileGrid>
          {categories.data.map((c) => (
            <Link key={c.name} to={categoryPath(c.name)} className="relative block aspect-[0.7] overflow-hidden rounded-xl shadow-md transition-transform active:scale-[0.98]">
              <img src={c.imageUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute inset-x-3 bottom-3">
                <span className="block font-kannada text-[18px] font-bold leading-snug">{c.name}</span>
                <span className="block text-[14px] opacity-85">{c.count} songs</span>
              </span>
            </Link>
          ))}
        </TileGrid>
      )}
    </Page>
  );
}

export function LyricsCategoryPage() {
  const { category } = useParams();
  const { data, error, reload } = useAsync(getLyrics, []);
  const [query, setQuery] = useState("");
  const items = (data ?? []).filter((l) => l.category === category && matches(l.title, query));
  return (
    <Page title={category} backTo="/lyrics" variant="gradient">
      <div className="mb-4">
        <SearchBox value={query} onChange={setQuery} placeholder="Search in this list" />
      </div>
      {error ? (
        <ErrorState onRetry={reload} />
      ) : !data ? (
        <SkeletonList />
      ) : items.length === 0 ? (
        <EmptyState title="No lyrics found" />
      ) : (
        <LyricList items={items} />
      )}
    </Page>
  );
}

function LyricList({ items, showCategory = false }) {
  return (
    <ul className="overflow-hidden rounded-2xl bg-white/10">
      {items.map((l) => (
        <li key={l.id} className="border-b border-white/15 last:border-0">
          <Link to={lyricPath(l)} className="flex min-h-[64px] items-center gap-3 px-3 py-2 active:bg-white/10">
            <img src={categoryImage(l.category)} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block font-kannada text-[17px] font-semibold leading-snug">{l.title}</span>
              {showCategory && <span className="block font-kannada text-[14px] opacity-75">{l.category}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LyricReaderPage() {
  const { category, id } = useParams();
  const back = categoryPath(category);
  const { data, error, loading, reload } = useAsync(() => getLyric(id), [id]);
  if (error) return <Page title="Lyrics" backTo={back} variant="gradient"><ErrorState onRetry={reload} /></Page>;
  if (loading && !data) return <Page title="" backTo={back} variant="gradient"><SkeletonList /></Page>;
  if (!data) return <Page title="Lyrics" backTo={back} variant="gradient"><EmptyState title="Not found" /></Page>;
  return <Reader key={data.id} title={data.title} html={data.html} storageKey={`lyrics:${data.id}`} backTo={back} />;
}
