import { Link, useNavigate, useParams } from "react-router-dom";
import Page from "../../layout/Page";
import Icon from "../../components/ui/Icon";
import { useAsync } from "../../hooks/useAsync";
import { getAudioLibrary } from "../../data/audio";
import { usePlayer } from "../../audio/context";
import { EmptyState, ErrorState, SkeletonList } from "../../components/ui/States";
import Equalizer from "./Equalizer";
import { audioTrackPath, isPlainClick, transitionName, tracksLabel } from "./paths";
import "./audio.css";

export default function AudioCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { data, error, reload } = useAsync(getAudioLibrary, []);
  const { track: playing, status, actions } = usePlayer();
  const category = data?.find((c) => c.id === categoryId);
  const tracks = category?.tracks ?? [];

  // play() runs inside the tap, before navigating, so iPhone Safari allows the sound.
  const playAll = () => {
    actions.setShuffle(false);
    actions.play(tracks, 0, { fresh: true });
    navigate(audioTrackPath(tracks[0]));
  };
  const shuffle = () => {
    actions.setShuffle(true);
    const i = Math.floor(Math.random() * tracks.length);
    actions.play(tracks, i, { fresh: true });
    navigate(audioTrackPath(tracks[i]));
  };

  return (
    <Page title={category?.name ?? "Audio"} backTo="/audio" variant="gradient" maxWidth="max-w-2xl">
      {error ? (
        <ErrorState message="Audio needs an internet connection." onRetry={reload} />
      ) : !data ? (
        <SkeletonList />
      ) : !category ? (
        <EmptyState title="Not found" message="This audio list could not be found." />
      ) : (
        <>
          {category.imageUrl && (
            <div className="mb-4 aspect-video overflow-hidden rounded-2xl bg-white/10 shadow-md">
              <img
                src={category.imageUrl}
                alt=""
                className="h-full w-full object-cover"
                style={{ viewTransitionName: transitionName("audio-cat", category.id) }}
              />
            </div>
          )}
          {tracks.length === 0 ? (
            <EmptyState title="No tracks yet" message="Please check again soon." />
          ) : (
            <>
              <p className="mb-3 text-[16px] opacity-85">{tracksLabel(tracks.length)}</p>
              <div className="mb-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={playAll}
                  className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl bg-tile px-3 text-[18px] font-semibold text-navy transition-transform active:scale-[0.98]"
                >
                  <Icon name="play" size={22} />
                  <span>Play all</span>
                </button>
                <button
                  type="button"
                  onClick={shuffle}
                  className="flex min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 border-white/60 bg-white/10 px-3 text-[18px] font-semibold transition-transform active:scale-[0.98]"
                >
                  <Icon name="shuffle" size={22} />
                  <span>Shuffle</span>
                </button>
              </div>
              <ul className="overflow-hidden rounded-2xl bg-white/10">
                {tracks.map((t, i) => {
                  const isCurrent = playing?.id === t.id && playing.categoryId === t.categoryId;
                  return (
                    <li key={t.id} className="audio-rise border-b border-white/15 last:border-0" style={{ "--d": `${Math.min(i, 8) * 40}ms` }}>
                      <Link
                        to={audioTrackPath(t)}
                        aria-current={isCurrent ? "true" : undefined}
                        onClick={(e) => {
                          if (isPlainClick(e)) actions.play(tracks, i);
                        }}
                        className={`flex min-h-[64px] items-center gap-3 px-3 py-2 active:bg-white/10 ${isCurrent ? "bg-white/20" : ""}`}
                      >
                        <span className="w-7 shrink-0 text-center text-[16px] tabular-nums opacity-80">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-kannada text-[17px] font-semibold leading-snug">{t.title}</span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[16px]">
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1.5 font-semibold">
                                <Equalizer playing={status === "playing" || status === "loading"} />
                                {status === "playing" ? "Now playing" : status === "loading" ? "Loading" : "Paused"}
                              </span>
                            )}
                            {t.lyrics && <span className="rounded-md border border-white/40 px-1.5 text-[14px] leading-6">Lyrics</span>}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
    </Page>
  );
}
