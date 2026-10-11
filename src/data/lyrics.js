import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase";
import { cached } from "./cache";

const str = (v) => (typeof v === "string" ? v : "");

const IMG = (file, token) =>
  `https://firebasestorage.googleapis.com/v0/b/arjun-guruji-app.appspot.com/o/Gallery%2F${file}?alt=media&token=${token}`;

// Same images as _getImageForCategory in lyrics_categories_page.dart.
const CATEGORY_IMAGES = {
  "ನಿತ್ಯ ಭಜನೆಗಳು": IMG("12.jpg", "e303f0bc-9117-49ba-ac8f-46cc6f7ab17e"),
  "ಇತರೆ": IMG("17.jpg", "9484a469-da31-4ab8-be68-7a1e02abd384"),
  "ಆರತಿ": IMG("aarti.png", "3b5d2065-f4a2-40cd-8456-c560a86b474f"),
};
export const categoryImage = (category) => CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES["ಆರತಿ"];

export const getLyrics = () =>
  cached("lyrics", async () => {
    const snap = await getDocs(collection(db, "Lyrics"));
    return snap.docs.map((doc) => {
      const d = doc.data();
      return { id: doc.id, title: str(d.title).trim(), category: str(d.category).trim(), html: str(d.content) };
    });
  });

// Categories sorted as in the app.
export async function getLyricCategories() {
  const lyrics = await getLyrics();
  const counts = new Map();
  for (const l of lyrics) counts.set(l.category, (counts.get(l.category) ?? 0) + 1);
  return [...counts.keys()].sort().map((name) => ({ name, count: counts.get(name), imageUrl: categoryImage(name) }));
}

export async function getLyric(id) {
  return (await getLyrics()).find((l) => l.id === id) ?? null;
}
