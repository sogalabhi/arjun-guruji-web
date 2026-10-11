import { Link } from "react-router-dom";
import Page from "../../layout/Page";
import { useAsync } from "../../hooks/useAsync";
import { getAudioLibrary } from "../../data/audio";
import { TileGrid, TileGridSkeleton } from "../../components/ui/ImageTile";
import { EmptyState, ErrorState } from "../../components/ui/States";
import { audioCategoryPath, tracksLabel, transitionName } from "./paths";
import "./audio.css";

export default function AudioCategoriesPage() {
  const { data, error, reload } = useAsync(getAudioLibrary, []);

  return (
    <Page title="Audio" variant="gradient">
      {error ? (
        <ErrorState message="Audio needs an internet connection." onRetry={reload} />
      ) : !data ? (
        <TileGridSkeleton count={4} />
      ) : data.length === 0 ? (
        <EmptyState title="No audio yet" message="Please check again soon." />
      ) : (
        <TileGrid>
          {data.map((c, i) => (
            <Link
              key={c.id}
              to={audioCategoryPath(c.id)}
              unstable_viewTransition
              className="audio-rise relative block aspect-[0.7] overflow-hidden rounded-xl bg-white/10 shadow-md transition-transform active:scale-[0.98]"
              style={{ "--d": `${Math.min(i, 8) * 40}ms` }}
            >
              {c.imageUrl ? (
                <img
                  src={c.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ viewTransitionName: transitionName("audio-cat", c.id) }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-tile to-accent" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute inset-x-3 bottom-3">
                <span className="block font-kannada text-[18px] font-bold leading-snug">{c.name}</span>
                <span className="block text-[16px] opacity-90">{tracksLabel(c.count)}</span>
              </span>
            </Link>
          ))}
        </TileGrid>
      )}
    </Page>
  );
}
