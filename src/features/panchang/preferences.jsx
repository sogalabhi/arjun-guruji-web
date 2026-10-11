import { createContext, useCallback, useContext, useState } from "react";

const Context = createContext(null);
const KEY = "panchang-city";
function savedCity() {
  try { return localStorage.getItem(KEY) || "Mysore"; } catch { return "Mysore"; }
}

export function PanchangPreferencesProvider({ children }) {
  const [city, update] = useState(savedCity);
  const setCity = useCallback((value) => {
    update(value);
    try { localStorage.setItem(KEY, value); } catch { /* Memory is enough when storage is unavailable. */ }
  }, []);
  return <Context.Provider value={{ city, setCity }}>{children}</Context.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePanchangPreferences = () => useContext(Context);
