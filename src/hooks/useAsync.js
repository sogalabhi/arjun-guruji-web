import { useCallback, useEffect, useState } from "react";

// Runs an async loader and tracks loading / data / error, with reload() for Retry.
export function useAsync(loader, deps) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ loading: true, data: undefined, error: undefined });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ loading: true, data: s.data, error: undefined }));
    loader().then(
      (data) => alive && setState({ loading: false, data, error: undefined }),
      (error) => alive && setState({ loading: false, data: undefined, error }),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
