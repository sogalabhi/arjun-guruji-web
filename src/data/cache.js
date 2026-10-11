// Each collection is fetched once per visit. Memory first, then sessionStorage
// (survives Safari reloading a background tab), then Firestore.
const memory = new Map();
const inflight = new Map();
const PREFIX = "fs:";

export function cached(key, loader) {
  if (memory.has(key)) return Promise.resolve(memory.get(key));
  try {
    const stored = sessionStorage.getItem(PREFIX + key);
    if (stored) {
      const value = JSON.parse(stored);
      memory.set(key, value);
      return Promise.resolve(value);
    }
  } catch {
    // Storage unavailable (private mode) or corrupt: fall through to network.
  }
  if (inflight.has(key)) return inflight.get(key);

  const promise = loader().then(
    (value) => {
      memory.set(key, value);
      inflight.delete(key);
      try {
        sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch {
        // Over quota (large books): memory cache is enough.
      }
      return value;
    },
    (error) => {
      inflight.delete(key);
      throw error;
    },
  );
  inflight.set(key, promise);
  return promise;
}

export function peek(key) {
  return memory.get(key);
}
