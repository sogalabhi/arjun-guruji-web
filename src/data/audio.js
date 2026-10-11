import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase";
import { cached } from "./cache";
import { buildLibrary } from "./audioTracks";

export { mapTrack } from "./audioTracks";

// Categories and all their tracks: 1 request for the categories plus 1 per
// category's `audios`, in parallel, cached for the session. This gives track
// counts on the tiles and lets a shared link resolve any track.
export const getAudioLibrary = () =>
  cached("audio", async () => {
    const snap = await getDocs(collection(db, "categories"));
    const raw = await Promise.all(
      snap.docs.map(async (doc) => {
        const audios = await getDocs(collection(db, "categories", doc.id, "audios"));
        return { id: doc.id, data: doc.data(), tracks: audios.docs.map((a) => ({ id: a.id, data: a.data() })) };
      }),
    );
    return buildLibrary(raw);
  });

export async function getAudioCategory(id) {
  return (await getAudioLibrary()).find((c) => c.id === id) ?? null;
}

export async function getTrack(categoryId, trackId) {
  const category = await getAudioCategory(categoryId);
  return category?.tracks.find((t) => t.id === trackId) ?? null;
}
