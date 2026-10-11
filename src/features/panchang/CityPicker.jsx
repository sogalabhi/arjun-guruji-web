import { useRef, useState } from "react";
import Icon from "../../components/ui/Icon";
import { useCities } from "./usePanchang";
import { normalizeCity } from "../../data/panchangCities";

export default function CityPicker({ city, onChange }) {
  const { data: cities, error, reload } = useCities();
  const [query, setQuery] = useState("");
  const details = useRef(null);
  const input = useRef(null);
  const matches = (cities ?? []).filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()) || (query.trim() && normalizeCity(query) === name));
  const choose = (name) => { onChange(name); setQuery(""); details.current.open = false; details.current.querySelector("summary").focus(); };
  return (
    <details ref={details} className="rounded-xl border border-white/30 bg-white/10" onToggle={(event) => { if (event.currentTarget.open) input.current?.focus(); }}>
      <summary className="flex min-h-tap cursor-pointer list-none items-center gap-2 px-3 py-2 text-[16px]"><Icon name="pin" size={20} /><span className="min-w-0 flex-1">City: {city}</span><span aria-hidden="true">⌄</span></summary>
      <div className="border-t border-white/20 p-3">
        <label className="block text-[16px]" htmlFor="city-search">Search city</label>
        <input ref={input} id="city-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a city name" className="mt-2 min-h-tap w-full rounded-lg bg-white px-3 text-[16px] text-ink" />
        {error ? <div className="mt-3" role="alert"><p className="text-[16px]">Could not load cities.</p><button type="button" onClick={reload} className="mt-2 min-h-tap rounded-lg border px-3">Try again</button></div> : !cities ? <p className="py-3" role="status">Loading cities…</p> : (
          <ul className="mt-2 max-h-64 overflow-auto" aria-label="Cities">
            {matches.map((name) => <li key={name}><button type="button" onClick={() => choose(name)} className={`flex min-h-tap w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[16px] ${name === city ? "bg-tile text-navy" : "active:bg-white/10"}`}>{name}{name === city && <span aria-label="Selected">✓</span>}</button></li>)}
            {!matches.length && <li className="py-3 text-[16px]">No cities found. Try another name.</li>}
          </ul>
        )}
      </div>
    </details>
  );
}
