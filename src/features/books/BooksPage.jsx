import { useState } from "react";
import Page from "../../layout/Page";
import { useAsync } from "../../hooks/useAsync";
import { bookKind, getBooks } from "../../data/books";
import ImageTile, { TileGrid, TileGridSkeleton } from "../../components/ui/ImageTile";
import SearchBox from "../../components/ui/SearchBox";
import { searchTitles } from "../../data/search";
import { EmptyState, ErrorState } from "../../components/ui/States";
import { bookPath } from "./paths";

export default function BooksPage() {
  const { data, error, reload } = useAsync(getBooks, []);
  const [query, setQuery] = useState("");
  const books = searchTitles(data ?? [], query);

  return (
    <Page title="Books" variant="gradient">
      <div className="mb-4">
        <SearchBox value={query} onChange={setQuery} placeholder="Search books" />
      </div>
      {error ? (
        <ErrorState onRetry={reload} />
      ) : !data ? (
        <TileGridSkeleton />
      ) : books.length === 0 ? (
        <EmptyState title="No books found" message={query ? "Try a different word." : undefined} />
      ) : (
        <TileGrid>
          {books.map((b) => (
            <ImageTile key={b.id} to={bookPath(b.id)} imageUrl={b.imageUrl} title={b.title} badge={bookKind(b) === "pdf" ? "PDF" : null} />
          ))}
        </TileGrid>
      )}
    </Page>
  );
}
