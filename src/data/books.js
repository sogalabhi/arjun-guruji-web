import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase";
import { cached } from "./cache";

const str = (v) => (typeof v === "string" ? v : "");

// Same mapping as the app's BookModel.fromJson: `content` is HTML for html
// books and the PDF URL for pdf books; chapters are {chapterName, content}.
export function mapBook(id, d) {
  const type = str(d.bookType);
  const content = str(d.content);
  const chapters = Array.isArray(d.chapters)
    ? d.chapters.map((c, i) => ({
        title: str(c?.chapterName).trim() || `Chapter ${i + 1}`,
        html: str(c?.content),
      }))
    : [];
  return {
    id,
    title: str(d.title).trim(),
    imageUrl: str(d.imageUrl),
    type,
    html: type === "html" ? content : "",
    pdfUrl: type !== "html" && type !== "chapters" ? content || str(d.pdfFilePath) : "",
    chapters,
  };
}

// Same routing rule as all_books_page.dart.
export function bookKind(book) {
  if (book.type === "chapters" && book.chapters.length) return "chapters";
  if (book.type === "html" && book.html) return "html";
  return "pdf";
}

export const getBooks = () =>
  cached("books", async () => {
    const snap = await getDocs(collection(db, "Books"));
    return snap.docs.map((doc) => mapBook(doc.id, doc.data()));
  });

export async function getBook(id) {
  return (await getBooks()).find((b) => b.id === id) ?? null;
}
