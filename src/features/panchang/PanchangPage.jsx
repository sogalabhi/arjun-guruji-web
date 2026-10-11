import { useSearchParams } from "react-router-dom";
import Page from "../../layout/Page";
import { dateKey, dateMillis, formatDate, MAX_DATE, MIN_DATE, validDate } from "../../data/dates";
import { useNow } from "../../hooks/useNow";
import { usePanchangPreferences } from "./preferences";
import CityPicker from "./CityPicker";
import PanchangPanel from "./PanchangPanel";

export default function PanchangPage() {
  const [params, setParams] = useSearchParams();
  const { city: savedCity, setCity } = usePanchangPreferences();
  const today = dateKey(useNow());
  const rawDate = params.get("date");
  const date = validDate(rawDate) ? rawDate : today;
  const city = params.get("city") || savedCity;
  const selectDate = (value) => { if (validDate(value)) setParams({ date: value, city }); };
  const selectCity = (value) => { setCity(value); setParams({ date, city: value }); };
  return (
    <Page title="Panchang" variant="gradient" maxWidth="max-w-2xl">
      <h2 className="text-xl font-semibold">{formatDate(dateMillis(date), true)}</h2>
      <div className="mt-5 grid gap-3">
        <div className="flex flex-wrap items-end gap-3"><label className="min-w-0 flex-1 text-[16px]">Date<input type="date" value={date} min={MIN_DATE} max={MAX_DATE} onChange={(event) => selectDate(event.target.value)} className="mt-2 block min-h-tap w-full min-w-0 rounded-xl bg-white px-3 py-2 text-[16px] text-ink" /></label><button type="button" onClick={() => selectDate(today)} className="min-h-tap rounded-xl bg-tile px-4 py-2 text-[16px] font-semibold text-navy">Today</button></div>
        <CityPicker city={city} onChange={selectCity} />
      </div>
      {rawDate && !validDate(rawDate) && <p role="status" className="mt-3 text-[16px]">That date is invalid. Showing today.</p>}
      <div className="mt-5"><PanchangPanel date={date} city={city} /></div>
    </Page>
  );
}
