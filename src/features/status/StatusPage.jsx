import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore/lite";
import { db } from "../../firebase";
import Page from "../../layout/Page";
import { ErrorState, SkeletonList } from "../../components/ui/States";

// Not linked from the UI. Open /status on a device to confirm Firestore is reachable.
export default function StatusPage() {
  const [state, setState] = useState({ loading: true });

  const load = useCallback(async () => {
    setState({ loading: true });
    try {
      const snap = await getDocs(query(collection(db, "Astottara"), limit(1)));
      const doc = snap.docs[0];
      setState({ loading: false, title: doc?.get("title") ?? "(no documents)" });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Page title="Status">
      {state.loading && <SkeletonList rows={1} />}
      {state.error && <ErrorState message={state.error} onRetry={load} />}
      {state.title && (
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-muted">Firestore connected. First Astottara:</p>
          <p className="mt-1 font-kannada text-lg">{state.title}</p>
        </div>
      )}
    </Page>
  );
}
