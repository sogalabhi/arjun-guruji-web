import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase";
import { mapEvent } from "./eventSchedule";

// Events change more often than books. Revalidate after five minutes instead
// of retaining a session-long snapshot on Safari tabs left open for days.
let snapshot;
let expires = 0;
let pending;

export function getEvents() {
  if (snapshot && Date.now() < expires) return Promise.resolve(snapshot);
  if (pending) return pending;
  pending = getDocs(collection(db, "events"))
    .then((result) => {
      snapshot = result.docs.map((doc) => mapEvent(doc.id, doc.data())).filter(Boolean);
      expires = Date.now() + 5 * 60 * 1000;
      return snapshot;
    })
    .finally(() => { pending = undefined; });
  return pending;
}
