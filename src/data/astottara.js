import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase";
import { cached } from "./cache";

const str = (v) => (typeof v === "string" ? v : "");

// Sort the list by title.
export const getAstottaras = () =>
  cached("astottara", async () => {
    const snap = await getDocs(collection(db, "Astottara"));
    return snap.docs
      .map((doc) => {
        const d = doc.data();
        return { id: doc.id, title: str(d.title).trim(), html: str(d.content), imageUrl: str(d.imageUrl) };
      })
      .sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
  });

export async function getAstottara(id) {
  return (await getAstottaras()).find((a) => a.id === id) ?? null;
}
