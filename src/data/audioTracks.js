// Pure Firestore mapping for Audio. No firebase imports, so node --test can load it.

const str = (v) => (typeof v === "string" ? v : "");

export function mapTrack(id, data, categoryId) {
  const d = data ?? {};
  return {
    id,
    categoryId,
    title: str(d.title).trim() || "Untitled track",
    audioUrl: str(d.audioUrl).trim(),
    imageUrl: str(d.imageUrl).trim(),
    lyrics: str(d.lyrics).replace(/\r\n?/g, "\n").trim(),
    category: str(d.category).trim(),
  };
}

// raw: [{ id, data, tracks: [{ id, data }] }] in Firestore document order.
// Tracks without an audio URL are dropped; a track without its own image or
// category name uses the category's.
export function buildLibrary(raw) {
  return raw.map(({ id, data, tracks }) => {
    const name = str(data?.name).trim() || id;
    const imageUrl = str(data?.imageUrl).trim();
    const mapped = tracks
      .map((t) => mapTrack(t.id, t.data, id))
      .filter((t) => t.audioUrl)
      .map((t) => ({ ...t, category: t.category || name, imageUrl: t.imageUrl || imageUrl }));
    return { id, name, imageUrl, count: mapped.length, tracks: mapped };
  });
}
