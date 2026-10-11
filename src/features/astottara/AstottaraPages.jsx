import { useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../../layout/Page";
import Reader from "../../reader/Reader";
import { useAsync } from "../../hooks/useAsync";
import { getAstottara, getAstottaras } from "../../data/astottara";
import ImageTile, { TileGrid, TileGridSkeleton } from "../../components/ui/ImageTile";
import SearchBox from "../../components/ui/SearchBox";
import { searchTitles } from "../../data/search";
import { astottaraPath as path } from "./paths";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";

export function AstottaraListPage() {
  const { data, error, reload } = useAsync(getAstottaras, []);
  const [query, setQuery] = useState("");
  const items = searchTitles(data ?? [], query);
  return (
    <Page title="Astottara" variant="gradient">
      <div className="mb-4">
        <SearchBox value={query} onChange={setQuery} placeholder="Search astottaras" />
      </div>
      {error ? (
        <ErrorState onRetry={reload} />
      ) : !data ? (
        <TileGridSkeleton />
      ) : items.length === 0 ? (
        <EmptyState title="Nothing found" message="Try a different word." />
      ) : (
        <TileGrid>
          {items.map((a) => (
            <ImageTile key={a.id} to={path(a.id)} imageUrl={a.imageUrl} title={a.title} />
          ))}
        </TileGrid>
      )}
    </Page>
  );
}

export function AstottaraReaderPage() {
  const { id } = useParams();
  const { data, error, loading, reload } = useAsync(() => getAstottara(id), [id]);
  if (error) return <Page title="Astottara" backTo="/astottara" variant="gradient"><ErrorState onRetry={reload} /></Page>;
  if (loading && !data) return <Page title="" backTo="/astottara" variant="gradient"><SkeletonList /></Page>;
  if (!data) return <Page title="Astottara" backTo="/astottara" variant="gradient"><EmptyState title="Not found" /></Page>;
  return <Reader key={data.id} title={data.title} html={data.html} storageKey={`astottara:${data.id}`} backTo="/astottara" />;
}
